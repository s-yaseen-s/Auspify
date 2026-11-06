const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite Database
const db = new sqlite3.Database('./exam.db', (err) => {
    if (err) console.error('Database connection error:', err.message);
    else console.log('Connected to SQLite database.');
});

// Create tables and seed initial questions if empty
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            option_a TEXT NOT NULL,
            option_b TEXT NOT NULL,
            option_c TEXT NOT NULL,
            option_d TEXT NOT NULL,
            correct_option TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT NOT NULL,
            score INTEGER NOT NULL,
            total INTEGER NOT NULL,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Seed sample questions
    db.get('SELECT COUNT(*) as count FROM questions', (err, row) => {
        if (row && row.count === 0) {
            const seedStmt = db.prepare(`
                INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_option)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            const sampleQuestions = [
                ['Which HTTP method is used to update an existing resource?', 'GET', 'POST', 'PUT', 'DELETE', 'C'],
                ['What keyword is used to declare a block-scoped variable in JS?', 'var', 'let', 'set', 'define', 'B'],
                ['Which SQL clause filters records after database aggregation?', 'WHERE', 'HAVING', 'GROUP BY', 'ORDER BY', 'B'],
                ['What is the primary role of Express.js in Node.js?', 'Database ORM', 'Routing & Middleware framework', 'Frontend compiler', 'Testing library', 'B'],
                ['What does status code 201 Created indicate?', 'Successful deletion', 'Successful resource creation', 'Bad Request', 'Server Error', 'B']
            ];
            sampleQuestions.forEach(q => seedStmt.run(q));
            seedStmt.finalize();
            console.log('Seeded initial exam questions.');
        }
    });
});

// GET /api/questions - Client gets questions (excluding correct_option for security)
app.get('/api/questions', (req, res) => {
    const query = 'SELECT id, question, option_a, option_b, option_c, option_d FROM questions';
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST /api/submit - Grade exam server-side and save score
app.post('/api/submit', (req, res) => {
    const { studentName, answers } = req.body; // answers = { questionId: "A", ... }

    if (!studentName || !answers) {
        return res.status(400).json({ error: 'Student name and answers are required.' });
    }

    db.all('SELECT id, correct_option FROM questions', [], (err, questions) => {
        if (err) return res.status(500).json({ error: err.message });

        let score = 0;
        const total = questions.length;

        questions.forEach(q => {
            if (answers[q.id] && answers[q.id].toUpperCase() === q.correct_option.toUpperCase()) {
                score++;
            }
        });

        const insertStmt = db.prepare(
            'INSERT INTO results (student_name, score, total) VALUES (?, ?, ?)'
        );
        insertStmt.run([studentName, score, total], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.status(201).json({
                resultId: this.lastID,
                studentName,
                score,
                total,
                percentage: ((score / total) * 100).toFixed(1)
            });
        });
        insertStmt.finalize();
    });
});

// GET /api/results - View past student submissions
app.get('/api/results', (req, res) => {
    db.all('SELECT * FROM results ORDER BY submitted_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Exam system running at http://localhost:${PORT}`);
});
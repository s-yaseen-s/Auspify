const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite Database
const db = new sqlite3.Database('./students.db', (err) => {
    if (err) console.error('Database connection error:', err.message);
    else console.log('Connected to SQLite database.');
});

// Create Students Table
db.run(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        course TEXT NOT NULL,
        grade TEXT NOT NULL
    )
`);

// API Routes

// 1. Get all students (Read)
app.get('/api/students', (req, res) => {
    db.all('SELECT * FROM students ORDER BY id DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. Add new student (Create)
app.post('/api/students', (req, res) => {
    const { name, email, course, grade } = req.body;
    if (!name || !email || !course || !grade) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    db.run(
        'INSERT INTO students (name, email, course, grade) VALUES (?, ?, ?, ?)',
        [name, email, course, grade],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: this.lastID, name, email, course, grade });
        }
    );
});

// 3. Update student record (Update)
app.put('/api/students/:id', (req, res) => {
    const { name, email, course, grade } = req.body;
    const { id } = req.params;

    db.run(
        'UPDATE students SET name = ?, email = ?, course = ?, grade = ? WHERE id = ?',
        [name, email, course, grade, id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});

// 4. Delete student record (Delete)
app.delete('/api/students/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM students WHERE id = ?', [id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
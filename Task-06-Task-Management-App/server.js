const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) console.error('Database connection error:', err.message);
    else console.log('Connected to SQLite tasks database.');
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            priority TEXT DEFAULT 'Medium',
            status TEXT DEFAULT 'Pending',
            due_date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.get('SELECT COUNT(*) as count FROM tasks', (err, row) => {
        if (row && row.count === 0) {
            const seedStmt = db.prepare(`
                INSERT INTO tasks (title, description, priority, status, due_date)
                VALUES (?, ?, ?, ?, ?)
            `);
            const sampleTasks = [
                ['Setup Task 6 Infrastructure', 'Initialize Express API routes and SQLite database schema.', 'High', 'Completed', '2026-11-10'],
                ['Design Responsive Dashboard', 'Build modern CSS grid and card layout for task management.', 'Medium', 'In Progress', '2026-11-12'],
                ['Prepare Final Internship Submission', 'Compile all 4 required task repositories and documentation.', 'High', 'Pending', '2026-11-15']
            ];
            sampleTasks.forEach(t => seedStmt.run(t));
            seedStmt.finalize();
            console.log('Seeded initial sample tasks.');
        }
    });
});

// GET /api/tasks - Retrieve tasks with optional filtering
app.get('/api/tasks', (req, res) => {
    const { status, priority } = req.query;
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
        query += ' AND status = ?';
        params.push(status);
    }
    if (priority && priority !== 'All') {
        query += ' AND priority = ?';
        params.push(priority);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST /api/tasks - Create new task
app.post('/api/tasks', (req, res) => {
    const { title, description, priority, due_date } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Task title is required.' });
    }

    const stmt = db.prepare(`
        INSERT INTO tasks (title, description, priority, status, due_date)
        VALUES (?, ?, ?, 'Pending', ?)
    `);

    stmt.run([title, description || '', priority || 'Medium', due_date || ''], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json(row);
        });
    });
    stmt.finalize();
});

// PUT /api/tasks/:id - Update task details or status
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, priority, status, due_date } = req.body;

    const query = `
        UPDATE tasks 
        SET title = COALESCE(?, title),
            description = COALESCE(?, description),
            priority = COALESCE(?, priority),
            status = COALESCE(?, status),
            due_date = COALESCE(?, due_date)
        WHERE id = ?
    `;

    db.run(query, [title, description, priority, status, due_date, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Task not found.' });

        db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        });
    });
});

// DELETE /api/tasks/:id - Delete task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Task not found.' });
        res.json({ message: 'Task deleted successfully', id });
    });
});

app.listen(PORT, () => {
    console.log(`Task Manager API running at http://localhost:${PORT}`);
});

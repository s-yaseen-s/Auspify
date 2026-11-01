const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


const db = new sqlite3.Database('./library.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the library database.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        genre TEXT NOT NULL,
        isbn TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL DEFAULT 'available'
    )`, (err) => {
        if (err) {
            console.error('Error creating books table:', err.message);
        } else {
            console.log('Books table created or already exists.');
        }
    });
});

app.get('/api/books', (req, res) => {
    const sql = 'SELECT * FROM books ORDER BY id DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/api/books', (req, res) => {
    const { title, author, isbn, genre } = req.body;

    if (!title || !author || !isbn || !genre) {
        return res.status(400).json({ error: 'All fields (title, author, isbn, genre) are required.' });
    }

    const sql = `INSERT INTO books (title, author, isbn, genre) VALUES (?, ?, ?, ?)`;
    const params = [title, author, isbn, genre];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        res.status(201).json({
            id: this.lastID,
            title,
            author,
            isbn,
            genre,
            status: 'available'
        });
    });
});

app.put('/api/books/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status field is required.' });
    }

    const sql = `UPDATE books SET status = ? WHERE id = ?`;
    
    db.run(sql, [status, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Book not found.' });
        }
        res.json({ message: 'Book status updated successfully', id, status });
    });
});

app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM books WHERE id = ?`;

    db.run(sql, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Book not found.' });
        }
        res.json({ message: 'Book deleted successfully', id });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
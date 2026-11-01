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



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
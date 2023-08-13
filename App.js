const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Use static files
app.use(express.static('public'));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Set up SQLite database connection
const dbPath = path.resolve(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

// Create employees table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        department TEXT,
        salary INTEGER
    )
`);

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Handle form submission
app.post('/add', (req, res) => {
    const { first_name, last_name, department, salary } = req.body;
    db.run(
        'INSERT INTO employees (first_name, last_name, department, salary) VALUES (?, ?, ?, ?)',
        [first_name, last_name, department, salary],
        (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Employee added successfully');
            res.redirect('/');
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

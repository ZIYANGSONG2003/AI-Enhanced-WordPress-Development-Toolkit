const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
const db = new Database('users.db', { verbose: console.log });

app.use(cors());
app.use(bodyParser.json());

// Create users table if it doesn't exist
db.prepare('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT)').run();

// Handle login requests
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);

    if (user) {
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid email or password');
    }
});

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});

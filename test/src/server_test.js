// server.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
const db = new Database(':memory:', { verbose: console.log }); // Use in-memory database for testing

app.use(cors());
app.use(bodyParser.json());

// Create users table for testing
db.prepare('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT)').run();

// Endpoint implementation
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);

    if (user) {
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid email or password');
    }
});

describe('POST /login', () => {
    beforeAll(() => {
        // Insert a test user into the in-memory database
        db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run('test@example.com', 'password123');
    });

    afterAll(() => {
        db.close();
    });

    test('should return 200 and success message for valid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Login successful');
    });

    test('should return 401 and error message for invalid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.text).toBe('Invalid email or password');
    });

    test('should return 401 and error message for non-existing user', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'nonexistent@example.com', password: 'password123' });

        expect(response.status).toBe(401);
        expect(response.text).toBe('Invalid email or password');
    });
});

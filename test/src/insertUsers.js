const Database = require('better-sqlite3');

const db = new Database('users.db', { verbose: console.log });

// Create users table if it doesn't exist
db.prepare('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT)').run();

// Insert users
const insertUser = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');

// Add your users here
const users = [
    { email: 'test@example.com', password: '123456' },
    { email: 'user1@example.com', password: 'pass1' },
    { email: 'user2@example.com', password: 'pass2' },
    // Add more users as needed
];

users.forEach(user => {
    try {
        insertUser.run(user.email, user.password);
        console.log(`Inserted user: ${user.email}`);
    } catch (err) {
        console.error(`Failed to insert user: ${user.email}`, err);
    }
});

console.log('All users inserted.');

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Connected to the mydatabase.db database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`, err => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log('Users table created or already exists.');

        const insertUsers = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
        const users = [
            { email: 'user1@example.com', password: 'password123' },
            { email: 'user2@example.com', password: 'password456' }
        ];

        for (const user of users) {
            const passwordHash = bcrypt.hashSync(user.password, 10);
            insertUsers.run(user.email, passwordHash, function(err) {
                if (err) {
                    console.error(err.message);
                    return;
                }
                console.log(`User ${this.lastID} inserted`);
            });
        }

        insertUsers.finalize(err => {
            if (err) {
                console.error(err.message);
                return;
            }
            // After all inserts are done, read and display user data
            db.each("SELECT id, email FROM users", (err, row) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
                console.log(`${row.id}: ${row.email}`);
            }, (err, count) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
                console.log(`Displayed ${count} users.`);

                // Close the database connection inside the final callback
                db.close(err => {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    console.log('Database connection closed.');
                });
            });
        });
    });
});

// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { fullname, username, email, password, location } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO UserRegistration (fullname, username, email, password_hash, location, registration_date)
                     VALUES (?, ?, ?, ?, ?, NOW())`;

        db.query(sql, [fullname, username, email, passwordHash, location], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Registration failed' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during registration' });
    }
});



router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM UserRegistration WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.user_id }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ token });
    });
});

module.exports = router;


const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const authenticateJWT = require('./middlewares/authMiddleware');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// API endpoint to get Income
app.get('/api/Income', (req, res) => {
    const sql = 'SELECT * FROM Income';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching income:', err);
            res.status(500).send('Error fetching income');
        } else {
            res.json(results);
        }
    });
});

// API endpoint to get Budget
app.get('/api/Budget', (req, res) => {
    const sql = 'SELECT * FROM Budget';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching budget:', err);
            res.status(500).send('Error fetching budget');
        } else {
            res.json(results);
        }
    });
});

// API endpoint to get Expenses
app.get('/api/Expenses', (req, res) => {
    const sql = 'SELECT * FROM Expenses';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching expenses:', err);
            res.status(500).send('Error fetching expenses');
        } else {
            res.json(results);
        }
    });
});

// Authentication routes
app.use('/api/auth', authRoutes);  // Mounting auth routes under /api/auth

// Example of a protected route (e.g., user profile)
app.get('/profile', authenticateJWT, (req, res) => {
    const sql = `SELECT * FROM UserRegistration WHERE user_id = ?`;
    db.query(sql, [req.userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to fetch profile' });
        }
        res.json(result[0]);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');  // Example auth route

// Load environment variables from .env file
dotenv.config();

const app = express();

// Security middlewares
app.use(helmet());  // Helps secure Express apps by setting various HTTP headers
app.use(cors());    // Enable Cross-Origin Resource Sharing for all routes

// Parse incoming JSON requests
app.use(express.json());

// Serve static files (your frontend files from the 'public' folder)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);  // Example API route for authentication

// Fallback route: Serve index.html for any unknown route (for SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

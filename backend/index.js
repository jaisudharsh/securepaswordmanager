const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to AWS RDS successfully!');
});

// User Registration
app.post('/signup', async (req, res) => {
    const { name, email, password, secret_key } = req.body;
    console.log('Signup Data:', { name, email, secret_key });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);

        db.query('INSERT INTO users (name, email, password_hash, secret_key) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, secret_key], (err) => {
                if (err) {
                    console.error('MySQL Insert Error:', err); // Show full DB error
                    return res.status(500).json({ error: 'Error registering user' });
                }
                res.json({ message: 'User registered successfully' });
            });
    } catch (err) {
        console.error('Signup Exception:', err);
        res.status(500).json({ error: 'Signup failed' });
    }
});


// User Login
app.post('/login', (req, res) => {

    const { email, password } = req.body;
    console.log('Login Attempt:', email);

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Login DB Error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
    
        if (results.length === 0) {
            console.log('No user found for email:', email);
            return res.status(400).json({ error: 'Invalid email or password' });
        }
    
        const user = results[0];
        console.log('User found:', user);
        console.log('Plain password:', password);
        console.log('Hashed password from DB:', user.password_hash);
    
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        console.log('Password match result:', passwordMatch);
    
        if (!passwordMatch) {
            console.log('Password mismatch');
            return res.status(400).json({ error: 'Invalid email or password' });
        }
    
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user.id, email: user.email, secret_key: user.secret_key, password_hash: user.password_hash});
    });
    
});


// Fetch Encrypted Passwords
app.get('/passwords/:userId', (req, res) => {
    const { userId } = req.params;
    db.query('SELECT id, service_name, encrypted_password FROM password_manager WHERE user_id = ?', 
    [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// Add New Password
app.post('/add-password', (req, res) => {
    console.log(req.body);
    const { userId, service_name, encrypted_password, secret_key, email, password_hash } = req.body;
    db.query('INSERT INTO password_manager (user_id, service_name, encrypted_password, secret_key, email, password_hash) VALUES (?, ?, ?, ?, ?, ?)', 
        [userId, service_name, encrypted_password, secret_key, email, password_hash], 
        (err) => {
            if (err) {
                console.error('Database Error:', err); // Log the error stack trace here
                return res.status(500).json({ error: 'Error adding password' });
            }
            res.json({ message: 'Password added successfully' });
        }
    );
});

// Get User Secret Key for Decryption
app.post('/verify-secret', (req, res) => {
    const { userId, secret_key } = req.body;
    db.query('SELECT secret_key FROM users WHERE id = ?', [userId], (err, results) => {
        if (err || results.length === 0) return res.status(400).json({ error: 'Invalid user' });

        if (results[0].secret_key !== secret_key) return res.status(401).json({ error: 'Invalid secret key' });

        res.json({ message: 'Secret key verified' });
    });
});

// Fetch All Data
app.get('/data', (req, res) => {
    const query = `
      SELECT * FROM users;
      SELECT * FROM password_manager;
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching data' });

        res.json({
            users: results[0],  // Data from the 'users' table
            passwords: results[1],  // Data from the 'password_manager' table
        });
    });
});

app.listen(3001, () => console.log('Server running on port 3001'));

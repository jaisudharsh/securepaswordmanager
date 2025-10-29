require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to Supabase PostgreSQL
const pool = new Pool({
  connectionString: process.env.SUPABASECONNECTIONURL,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log('Connected to Supabase PostgreSQL'))
  .catch(err => console.error('Database connection error', err));

// -------------------- ROUTES -------------------- //

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// User Registration
app.post('/signup', async (req, res) => {
  const { name, email, password, secret_key } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password_hash, secret_key) VALUES ($1, $2, $3, $4)',
      [name, email, hashedPassword, secret_key]
    );

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      userId: user.id,
      email: user.email,
      secret_key: user.secret_key,
      password_hash: user.password_hash,
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Fetch Encrypted Passwords for a User
app.get('/passwords/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, service_name, encrypted_password FROM password_manager WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch Passwords Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add New Password
app.post('/add-password', async (req, res) => {
  const { userId, service_name, encrypted_password, secret_key, email, password_hash } = req.body;
  try {
    await pool.query(
      `INSERT INTO password_manager 
      (user_id, service_name, encrypted_password, secret_key, email, password_hash) 
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, service_name, encrypted_password, secret_key, email, password_hash]
    );
    res.json({ message: 'Password added successfully' });
  } catch (err) {
    console.error('Add Password Error:', err);
    res.status(500).json({ error: 'Error adding password' });
  }
});

// Verify Secret Key
app.post('/verify-secret', async (req, res) => {
  const { userId, secret_key } = req.body;
  try {
    const result = await pool.query('SELECT secret_key FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid user' });
    if (result.rows[0].secret_key !== secret_key) return res.status(401).json({ error: 'Invalid secret key' });

    res.json({ message: 'Secret key verified' });
  } catch (err) {
    console.error('Verify Secret Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Fetch All Data (users + password_manager)
app.get('/data', async (req, res) => {
  try {
    const usersResult = await pool.query('SELECT * FROM users');
    const passwordsResult = await pool.query('SELECT * FROM password_manager');

    res.json({
      users: usersResult.rows,
      passwords: passwordsResult.rows,
    });
  } catch (err) {
    console.error('Fetch All Data Error:', err);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// -------------------- START SERVER -------------------- //
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

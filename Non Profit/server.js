const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'app_user',
  password: 'Amma@6648',
  database: 'nonprofit_db'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to the database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the root directory (if needed)
app.use(express.static(path.join(__dirname)));

// Route to serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to serve donate.html
app.get('/donate', (req, res) => {
  res.sendFile(path.join(__dirname, 'donate.html'));
});

// Handle POST request from the donate form
app.post('/donate', (req, res) => {
  const { name, phone, email, amount } = req.body;
  
  // SQL query to insert data into the database
  const query = 'INSERT INTO donations (name, phone, email, amount) VALUES (?, ?, ?, ?)';
  db.query(query, [name, phone, email, amount], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Redirect to thankyou.html after successful donation
    res.redirect('/thankyou.html');
  });
});

// Route to serve thankyou.html
app.get('/thankyou.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'thankyou.html'));
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

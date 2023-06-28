const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = 3000;

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password',
  database: 'lms_db'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Set up EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Home page
app.get('/', (req, res) => {
  // Fetch data from MySQL and pass it to the template
  connection.query('SELECT * FROM courses', (err, results) => {
    if (err) throw err;
    res.render('index', { courses: results });
  });
});

// Add course page
app.get('/add-course', (req, res) => {
  res.render('add-course');
});

// Create course
app.post('/add-course', (req, res) => {
  const { title, description } = req.body;
  const course = { title, description };
  
  connection.query('INSERT INTO courses SET ?', course, (err, result) => {
    if (err) throw err;
    console.log('Course added');
    res.redirect('/');
  });
});

// Edit course page
app.get('/edit-course/:id', (req, res) => {
  const courseId = req.params.id;
  
  connection.query('SELECT * FROM courses WHERE id = ?', courseId, (err, result) => {
    if (err) throw err;
    res.render('edit-course', { course: result[0] });
  });
});

// Update course
app.post('/edit-course/:id', (req, res) => {
  const courseId = req.params.id;
  const { title, description } = req.body;
  const updatedCourse = { title, description };
  
  connection.query('UPDATE courses SET ? WHERE id = ?', [updatedCourse, courseId], (err, result) => {
    if (err) throw err;
    console.log('Course updated');
    res.redirect('/');
  });
});

// Delete course
app.get('/delete-course/:id', (req, res) => {
  const courseId = req.params.id;
  
  connection.query('DELETE FROM courses WHERE id = ?', courseId, (err, result) => {
    if (err) throw err;
    console.log('Course deleted');
    res.redirect('/');
  });
});

// Search courses
app.post('/search', (req, res) => {
  const { keyword } = req.body;
  
  connection.query('SELECT * FROM courses WHERE title LIKE ?', '%' + keyword + '%', (err, results) => {
    if (err) throw err;
    res.render('index', { courses: results });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

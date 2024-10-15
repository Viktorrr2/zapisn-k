const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'school'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});


app.get('/api/students', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


app.post('/api/students', (req, res) => {
    const { name, class_id } = req.body;
    db.query('INSERT INTO students (name, class_id) VALUES (?, ?)', [name, class_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, name, class_id });
    });
});


app.post('/api/students/:id/grades', (req, res) => {
    const studentId = req.params.id;
    const { grade, weight, description } = req.body;
    db.query('INSERT INTO grades (student_id, grade, weight, description) VALUES (?, ?, ?, ?)', 
             [studentId, grade, weight, description], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, studentId, grade, weight, description });
    });
});


app.delete('/api/students/:id', (req, res) => {
    const studentId = req.params.id;
    db.query('DELETE FROM students WHERE id = ?', [studentId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
        res.status(204).send();
    });
});

app.get('/api/students/:id/average', (req, res) => {
    const studentId = req.params.id;
    db.query('SELECT AVG(grade) AS average FROM grades WHERE student_id = ?', [studentId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ average: results[0].average });
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

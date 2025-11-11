const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 3000;



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Welcome to the Notes API!',
        status: 'Server is running correctly.',
        documentation: '/api-docs'
    });
});
// ----------------------------------------------------


// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Notes App API', version: '1.0.0', description: 'A simple API for managing notes' },
    servers: [{ url: `http://localhost:${port}`, description: 'Development server' }],
  },
  apis: ['./main.js'],
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

// MySQL Connection
const db = mysql.createConnection({
  host: "5qiela.h.filess.io",
  user: "BlocNoteAmouna12_verticalam",
  password: "86faa9260b5d16a6d64556d5e43bbea8cfc666b7",
  database: "BlocNoteAmouna12_verticalam",
  port: 3307
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS notes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createTableQuery, err => {
    if (err) throw err;
    console.log('Notes table created or already exists');
  });
});

// Routes
app.get('/api/notes', (req, res) => {
  db.query('SELECT * FROM notes ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/notes/:id', (req, res) => {
  db.query('SELECT * FROM notes WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Note not found' });
    res.json(result[0]);
  });
});

app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
  db.query('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Note created successfully', id: result.insertId, title, content });
  });
});

app.put('/api/notes/:id', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
  db.query('UPDATE notes SET title = ?, content = ? WHERE id = ?', [title, content, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note updated successfully' });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  db.query('DELETE FROM notes WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted successfully' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// Exporter app pour les tests
module.exports = app;

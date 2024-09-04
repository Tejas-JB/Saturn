const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from "css", "images", and "js" directories
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/home.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});
app.get('/detail', (req, res) => {
  res.sendFile(path.join(__dirname, 'detail_events.html'));
});
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

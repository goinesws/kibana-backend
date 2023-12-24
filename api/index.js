const express = require('express')
const app = express()
const port = 3000
const db = require('../db');


app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log('Server is running on port 3000');
});
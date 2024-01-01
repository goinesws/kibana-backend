const db = require('../db');
const express = require('express');
const app = express();
const port = 3000;

// app.get('/', async (req, res) => {
//     try {
//         const result = await db.any('SELECT * FROM users');
//         res.json(result);
//     } catch (error) {
//         console.error('Error executing query:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

app.get('/', async (req, res) => {
  try {
      const result = await db.any('select * from users');
      res.json(result);
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    console.log('Login Hit');
    let username_email = req.body.username_email;
    let password = req.body.password;
    console.log('Username : ' + username_email);
    console.log('Password : ' + password);

    const status = await db.func('check_user_role', [username_email]);

    console.log(status);
    if (status == 0) {
      res.status(404).json({'status_code' : '404', 'message' : 'No Such Account Exists'});
    }
    res.status(200);
    res.json(status);
  } catch {
    res.status(500).json({'status_code' : '500', 'message' : 'Internal Server Error'});
  }
});


app.listen(port, () => {
  console.log('Server is running on port 3000');
});
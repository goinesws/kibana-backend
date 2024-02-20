const express = require('express');
const app = express();
const router = require('./routes/router')
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log('Server is running on port 3000');
});

app.use('/', router);
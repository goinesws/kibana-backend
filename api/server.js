const express = require('express');
const app = express();
const router = require('./routes/router');
const multer = require('multer');
const { google } = require('googleapis');
const upload = multer({ dest: 'uploads/' });
const port = 3000;
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
var session = require('express-session');
const { 
  v4: uuidv4,
} = require('uuid');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session
  ({ 
  genid: function(req) {
    return uuidv4() 
  },
  secret: 'kibana',   
  resave: true, 
  saveUninitialized: true, 
  cookie: { maxAge: 86400 },
  }));

app.listen(port, () => {
  console.log('Server is running on port 3000');
});

app.use('/', router);


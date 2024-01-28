const express = require('express');
const app = express();
const model = require('../models/taskModel');

app.getNewTask = async (req, res) =>  {
  console.log(req.params);

  let task = model.getNewTask(req.params.categoryId);

  res.send('Halo');
}

module.exports = app;
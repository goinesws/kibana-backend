const express = require('express');
const app = express();
const model = require('../models/taskModel');

app.getNewTaskByCategory = async (req, res) =>  {
  console.log(req.params);

  var result = {};
  result.error_schema = {};
  result.output_schema = {task: ''};

  let modelResult = await model.getNewTaskByCategory(req.params.categoryId);

  console.log(modelResult);

  if (modelResult == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.task = modelResult;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.task = modelResult;
  }

  res.send(result);
}

app.getTaskCategoryDetails = async (req, res) => {
  res.send('HAlo');
}

app.getTaskCategories = async (req, res) => {
  var result = {};

  result.error_schema = {};
  result.output_schema = {categories: ''};

  let modelResult = await model.getTaskCategories();

  console.log(modelResult);

  if (modelResult == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.categories = modelResult;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.categories = modelResult;
  }

  res.send(result);
}

module.exports = app;
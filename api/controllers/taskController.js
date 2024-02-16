const express = require('express');
const app = express();
const task = require('../models/taskModel.js')

app.getNewTaskByCategory = async (req, res) =>  {
  console.log(req.params);

  var result = {};
  result.error_schema = {};
  result.output_schema = {task: ''};

  let taskResult = await task.getNewTaskByCategory(req.params.categoryId);

  console.log(taskResult);

  if (taskResult == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.task = taskResult;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.task = taskResult;
  }

  res.send(result);
}

app.getTaskCategoryDetail = async (req, res) => {
  var result = {};

  result.error_schema = {};
  result.output_schema = {sub_categories: ''};

  let taskResult = await task.getTaskCategoryDetail(req.params.categoryId);

  console.log(taskResult);

  if (taskResult == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.sub_categories = taskResult;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.sub_categories = taskResult;
  }

  res.send(result);
}

app.getTaskCategories = async (req, res) => {
  var result = {};

  result.error_schema = {};
  result.output_schema = {categories: ''};

  let taskResult = await task.getTaskCategories();

  console.log(taskResult);

  if (taskResult == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.categories = taskResult;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.categories = taskResult;
  }

  res.send(result);
}

app.getTaskDetails = async (req, res) => {
  var result = {};

  result.error_schema = {};
  result.output_schema = {};

  let taskDetailResult = await task.getTaskDetails(req.params.taskId);

  console.log(taskDetailResult);

  if (taskDetailResult == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.categories = taskDetailResult;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.categories = taskDetailResult;
  }
  
  res.send(result);
}

module.exports = app;
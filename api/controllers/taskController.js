const express = require('express');
const app = express();
const Task = require('../models/taskModel.js');

app.getNewTaskByCategory = async (req, res) =>  {
  console.log(req.params);

  var result = {};
  result.error_schema = {};
  result.output_schema = {tasks: ''};

  let taskResult = await Task.getNewTaskByCategory(req.params.categoryId);

  // console.log(taskResult);

  if (taskResult == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.tasks = taskResult;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.tasks = taskResult;
  }

  res.send(result);
}

app.getTaskDetails = async (req, res) => {
  var result = {};

  result.error_schema = {};
  result.output_schema = {};

  let taskDetailResult = await Task.getTaskDetails(req.params.taskId);

  // console.log(taskDetailResult);

  if (taskDetailResult == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema = taskDetailResult;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema = taskDetailResult;
  }
  
  res.send(result);
}

app.getTaskList = async (req, res) => {
  var result = {};

  result.error_schema = {};
  result.output_schema = {};

  let taskListResult = await Task.getTaskList(req.headers);
  let total_amount = taskListResult.length;
  let has_next_page = true;

  if(req.headers.last_id !== "") {
    const indexOfTarget = taskListResult.findIndex(obj => obj.id === req.headers.last_id)
    if (indexOfTarget !== -1) {
      taskListResult = taskListResult.slice(indexOfTarget + 1, indexOfTarget + 9);
    } else {
      console.log('Object with specified id not found.');
    }
    if(total_amount - (indexOfTarget + 1) > 8) has_next_page = true;
    else has_next_page = false;
  } else {
    taskListResult = taskListResult.slice(0, 8);
    if(total_amount > 8) has_next_page = true;
    else has_next_page = false;
  }

  if (taskListResult == "" || taskListResult == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.tasks = taskListResult;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.tasks = taskListResult;
    result.output_schema.total_amount = total_amount;
    result.output_schema.has_next_page = has_next_page;
    result.output_schema.last_id = taskListResult[taskListResult.length - 1].id;
  }
  
  res.send(result);
}

module.exports = app;
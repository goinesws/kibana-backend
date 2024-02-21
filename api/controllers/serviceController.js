const express = require('express');
const app = express();
const Service = require('../models/serviceModel.js')
const Subcategory = require('../models/subcategoryModel.js')

app.getNewService = async (req, res) =>  {
  var result = {};
  result.error_schema = {};
  result.output_schema = {task: ''};

  const category_id = req.params.categoryId;

  const service = new Service();
  var serviceResult;
  if(category_id) serviceResult = await Service.getNewService(category_id);
  else serviceResult = await Service.getNewServiceNoCat();

  if (Array.isArray(serviceResult) && serviceResult.length === 0) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.services = serviceResult;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.services = serviceResult;
  }

  res.send(result);
}

app.getServiceByCategory = async (req, res) =>  {
  var result = {};
  result.error_schema = {};
  result.output_schema = {task: ''};

  const category_id = req.params.categoryId;

  const service = new Service();
  var serviceResult = await Service.getServiceByCategory(category_id);

  if (Array.isArray(serviceResult) && serviceResult.length === 0) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.services = serviceResult;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.services = serviceResult;
  }

  res.send(result);
}

module.exports = app;
const express = require('express');
const app = express();
const Service = require('../models/serviceModel.js')
const Subcategory = require('../models/subcategoryModel.js')

app.getNewService = async (req, res) =>  {
  var result = {};
  result.error_schema = {};
  result.output_schema = {services: ''};

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
  result.output_schema = {services: ''};

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

app.getServiceList = async (req, res) =>  {
  var result = {};
  result.error_schema = {};
  result.output_schema = {services: ''};

  let serviceListResult = await Service.getServiceList(req.headers);
  let total_amount = serviceListResult.length;
  let has_next_page = true;

  if(req.headers.last_id !== "") {
    const indexOfTarget = serviceListResult.findIndex(obj => obj.id === req.headers.last_id)
    if (indexOfTarget !== -1) {
      serviceListResult = serviceListResult.slice(indexOfTarget + 1, indexOfTarget + 13);
    } else {
      console.log('Object with specified id not found.');
    }
    if(total_amount - (indexOfTarget + 1) > 12) has_next_page = true;
    else has_next_page = false;
  } else {
    serviceListResult = serviceListResult.slice(0, 12);
    if(total_amount > 8) has_next_page = true;
    else has_next_page = false;
  }

  if (serviceListResult == "" || serviceListResult == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.services = serviceListResult;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.services = serviceListResult;
    result.output_schema.total_amount = total_amount;
    result.output_schema.has_next_page = has_next_page;
    result.output_schema.last_id = serviceListResult[serviceListResult.length - 1].id;
  }
  
  res.send(result);
}

module.exports = app;
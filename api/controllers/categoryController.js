const express = require('express');
const app = express();
const Category = require('../models/categoryModel.js');

app.getAllCategorySubcategory = async (req, res) =>  {
    var result = {};
    result.error_schema = {};
    result.output_schema = {categories: ''};
  
    const cat = new Category();
    var subcatResult = await Category.getAllCategorySubcategory();
  
    if (Array.isArray(subcatResult) && subcatResult.length === 0) {
      result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
      result.output_schema.categories = subcatResult;
    } else {
      result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
      result.output_schema.categories = subcatResult;
    }
  
    res.send(result);
  }

app.getAllCategorySubcategoryTask = async (req, res) => {
  var result = {};

  result.error_schema = {};
  result.output_schema = {categories: ''};

  let category = await Category.getAllCategorySubcategoryTask();

  // console.log(taskResult);

  if (category == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.categories = category;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.categories = category;
  }

  res.send(result);
}

module.exports = app;
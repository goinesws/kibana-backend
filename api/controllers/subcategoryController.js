const express = require('express');
const app = express();
const Subcategory = require('../models/subcategoryModel.js');

module.exports = app;

app.getSubcategoryByCategory = async (req, res) =>  {
  var result = {};
  result.error_schema = {};
  result.output_schema = {sub_categories: ''};

  const category_id = req.params.categoryId;

  const subcatInstance = new Subcategory();
  var subcatResult = await subcatInstance.getSubcatByCategoryID(category_id);

  if (Array.isArray(subcatResult) && subcatResult.length === 0) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.sub_categories = subcatResult;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.sub_categories = subcatResult;
  }

  res.send(result);
}

app.getadditionalInfoBySubcategoryId = async (req, res) =>  {
  var result = {};
  result.error_schema = {};
  result.output_schema = {additional_info: ''};

  const subcategory_id = req.params.subcategoryId;

  let subcatResult;

  if (req.get('X-Token') == req.session.id) {
    const subcatInstance = new Subcategory();
    subcatResult = await subcatInstance.getadditionalInfoBySubcategoryId(subcategory_id);
    if (subcatResult == null) {
      result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
      result.output_schema = null;
    } else {
      result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
      result.output_schema.additional_info = subcatResult;
    }
  } else {
    result.error_schema = {'error_code': 403, 'error_message': 'Forbidden.'};
    result.output_schema = null;
  }

  res.send(result);
}

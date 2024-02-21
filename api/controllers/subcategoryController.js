const express = require('express');
const app = express();
const Subcategory = require('../models/subcategoryModel.js');

module.exports = app;

app.getSubcategoryByCategory = async (req, res) =>  {
  var result = {};
  result.error_schema = {};
  result.output_schema = {sub_categories: ''};

  const category_id = req.params.categoryId;

  const subcat = new Subcategory();
  var subcatResult = await Subcategory.getSubcatByCategoryID(category_id);

  if (Array.isArray(subcatResult) && subcatResult.length === 0) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.sub_categories = subcatResult;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.sub_categories = subcatResult;
  }

  res.send(result);
}
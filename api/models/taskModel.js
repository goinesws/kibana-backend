const express = require("express");
const db = require("../../db");

module.exports = class Task {
  static async getNewTaskByCategory(categoryId) {
    // get list of SUBCAT BY CATEGORY ID
    let SPGetSubcat = `select subcategory_id from public.subcategory where category_id = '${categoryId}';`;

    var listSubcat = await db.any(SPGetSubcat);

    console.log(listSubcat);

    if (listSubcat == null || listSubcat.length == 0) {
      return null;
    }

    // rewrite list subcat buat masuk SP
    var listSubcatSP = "(";

    for (var i = 0; i < listSubcat.length; i++) {
      listSubcatSP += "'" + listSubcat[i].subcategory_id + "'";
      if (i == listSubcat.length - 1) {
        listSubcatSP += ")";
      } else {
        listSubcatSP += ",";
      }
    }

    console.log(listSubcatSP);

    let SPGetTask = `select task_id as id, name, description, tags, deadline as due_date, difficulty, price from public.task where sub_category_id in ${listSubcatSP} and status = 'ChooseFreelancer' order by deadline ASC limit 4;`;

    console.log(SPGetTask);

    var result = await db.any(SPGetTask);

    console.log(result);

    return result;
  }

  static async getTaskCategoryDetails(categoryId) {}

  static async getTaskCategories() {
    var result = {};

    let SPGetCategories = `select category_id as id, name, image from public.category`;

    result = await db.any(SPGetCategories);

    if (result.ength == 0) {
      return null;
    }

    console.log(result);

    // get count
    for (var i = 0; i < result.length; i++) {
      
    }

    let SPGetSubcategories = ``;

    return result;
  }
}

 

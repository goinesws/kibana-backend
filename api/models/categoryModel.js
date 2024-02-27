const express = require("express");
const db = require("../../db");
const Subcategory = require('../models/subcategoryModel')

module.exports = class Category {
  async getAllCategoriesForTask() {
    let SPGetCategories = `select category_id as id, name, image from public.category`;

    let result = await db.any(SPGetCategories);

    return result;
  }

  async getAllCategorySubcategory() {
    let SPGetCategories = `
    select category.category_id as id, category.name as name, category.image as image_url, 
        COALESCE(
            (SELECT COUNT(service.subcategory_id) 
             FROM service
             JOIN subcategory ON service.subcategory_id = subcategory.subcategory_id
             WHERE category_id = category.category_id
             GROUP BY subcategory.category_id), 0) AS service_amount,
        jsonb_agg(
                json_build_object(
                    'id', subcategory.subcategory_id,
                    'name', subcategory.name
                )
            ) AS sub_categories
        from 
          category
        inner join 
          subcategory on subcategory.category_id = category.category_id
        GROUP BY
            category.category_id, category.name, category.image
      ORDER BY id asc`;

    let result = await db.any(SPGetCategories);

    return result;
  }

  async getAllCategorySubcategoryTask() {
    const subcatInstance = new Subcategory();
    let result = await Category.getAllCategoriesForTask();

    // console.log(result);
    if (result.length == 0) {
      return null;
    }
    // get subcategories
    // get all the subcategories for each category
    for (let i = 0; i < result.length; i++) {
      let subcatResult = await subcatInstance.getSubcatLiteByCategoryID(result[i].id);

      // console.log('Subcat Result');
      // console.log(subcatResult);
      // get amount based on subcat
      let count = 0;
      for (let j = 0; j < subcatResult.length; j++) {       
        let countResult = await subcatInstance.getSubcatCountByID(subcatResult[j].id);
        // console.log('Count Result di Task Model');
        // console.log(countResult.count);
        count +=  parseInt(countResult.count);
      }
      result[i].task_amount = count;
      result[i].sub_categories = subcatResult;
    }

    return result;
  }
};

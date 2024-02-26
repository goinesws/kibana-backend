const express = require("express");
const db = require("../../db");

module.exports = class Category {
  static async getAllCategoriesForTask() {
    let SPGetCategories = `select category_id as id, name, image from public.category`;

    let result = await db.any(SPGetCategories);

    return result;
  }

  static async getAllCategorySubcategory() {
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
};

const express = require("express");
const db = require("../../db");
const Subcategory = require("../models/subcategoryModel");
const Category = require("../models/categoryModel");
const Client = require("../models/clientModel");
const Freelancer = require("../models/freelancerModel");
const Review = require("../models/reviewModel");
const { search } = require("../controllers/userController");

module.exports = class Task {
  static async getTaskList(req, res) {
    const searchText = req.body.search_text;
    const subcategory = req.body.sub_category;
    const budget = req.body.budget;
    const budgetStart = req.body.budget.budget_start;
    const budgetEnd = req.body.budget.budget_end;
    const difficulty = req.body.difficulty;
    const lastId = req.body.last_id;
    let SP = `
      SELECT * FROM public.task
      WHERE (name || description ILIKE '%${searchText}%'
      OR '${searchText}' ILIKE ANY (tags))
    `;
    if (subcategory !== null) {
      SP += `AND sub_category_id WHERE '${subcategories}'`;
    }
    if (budget !== null) {
      if (budgetEnd !== null) {
        SP += `AND price BETWEEN '${budgetStart}' AND '${budgetEnd}'`;
      } else {
        SP += `AND price > '${budgetStart}'`;
      }
    }
    if (difficulty !== null) {
      SP += `AND difficulty = '${difficulty}'`;
    }

    result = await db.any(SPGetCategories);
  }

  static async getNewTaskByCategory(categoryId) {
    // get list of SUBCAT BY CATEGORY ID
    let subcat_list = await Subcategory.getListSubcatByCategoryID(categoryId);

    // console.log(subcat_list);

    let SPGetTask = `select task_id as id, name, description, tags, deadline as due_date, difficulty, price from public.task where sub_category_id in 
    ${subcat_list} and status = 'ChooseFreelancer' order by deadline ASC limit 4;`;

    // console.log(SPGetTask);

    let result = await db.any(SPGetTask);

    // console.log(result);
    // dari resultnya dijadiin ke constructornya dlu
    return result;
  }

  static async getTaskCategoryDetail(categoryId) {
    let result = await Subcategory.getSubcatByCategoryID(categoryId);

    if (result.length == 0) return null;
    else return result;
  }

  static async getTaskCategories() {
    let result = await Category.getAllCategoriesForTask();
    // console.log(result);
    if (result.length == 0) {
      return null;
    }
    // get subcategories
    // get all the subcategories for each category
    for (let i = 0; i < result.length; i++) {
      let subcatResult = await Subcategory.getSubcatLiteByCategoryID(result[i].id);

      // console.log('Subcat Result');
      // console.log(subcatResult);
      // get amount based on subcat
      let count = 0;
      for (let j = 0; j < subcatResult.length; j++) {       
        let countResult = await Subcategory.getSubcatCountByID(subcatResult[j].id);
        // console.log('Count Result di Task Model');
        console.log(countResult.count);
        count +=  parseInt(countResult.count);
      }
      result[i].task_amount = count;
      result[i].sub_categories = subcatResult;
    }

    return result;
  }

  static async getTaskDetails (taskId) {
    let result = {};
    // SP buat task details
    let SPTaskDetails = `select task_id as id, name, tags, deadline as due_date, difficulty, price, description 
    from public.task where "task_id" = '${taskId}';`;

    let temp_task_detail = await db.any(SPTaskDetails);

    result.task_detail = temp_task_detail[0];

    let temp_client = await Client.getClientByTaskID(taskId);

    result.client = temp_client;

    let temp_registered_freelancer = await Freelancer.getFreelancerByTaskID(taskId);

    result.registered_freelancer = temp_registered_freelancer;

    let temp_res_get_client_client_review_list = await Review.getClientReviewByTaskID(taskId);
    let temp_res_get_client_review_rating_amount = await Review.getClientReviewRatingAmountByTaskID(taskId);
    let temp_res_get_client_avg_rating = await Review.getClientAvgRatingByTaskID(taskId);

    result.review = {};

    result.review.average_rating = temp_res_get_client_avg_rating.average_rating;
    result.review.rating_amount = temp_res_get_client_review_rating_amount.rating_amount;
    result.review.review_list = temp_res_get_client_client_review_list;

    return result;
  }
}

 

const express = require("express");
const db = require("../../db");
const Subcategory = require("../models/subcategoryModel");
const Category = require("../models/categoryModel");
const Client = require("../models/clientModel");
const Freelancer = require("../models/freelancerModel");
const Review = require("../models/reviewModel");
const { search } = require("../controllers/userController");

module.exports = class Task {
  static async getTaskList(headers) {
    const searchText = headers['search_text'];
    const subcategory = headers['sub_category'];
    const budget = headers['budget'];
    const difficulty = headers['difficulty'];
    const lastId = headers['last_id'];

    let SP = `SELECT task_id as id, name, description, tags, deadline as due_date, difficulty, price FROM public.task`;

    if (searchText !== "") {
      SP += ` WHERE (name || description ILIKE '%${searchText}%'
      OR '${searchText}' ILIKE ANY (tags))`;
    }
    if (subcategory !== "") {
      if(searchText!=="") SP +=` AND`
      else SP += ` WHERE`
      SP += ` sub_category_id = '${subcategory}'`;
    }
    if (budget !== "") {
      const budgetObject = JSON.parse(budget);
      const budgetStart = budgetObject.budget_start;
      const budgetEnd = budgetObject.budget_end;

      if(searchText!=="" || subcategory!=="") SP +=` AND`
      else SP += ` WHERE`
      if (budget.budget_end !== null) {
        SP += ` price BETWEEN '${budgetStart}' AND '${budgetEnd}'`;
      } else {
        SP += ` price > '${budgetStart}'`;
      }
    }

    if (difficulty !== "") {
      if(searchText!=="" || subcategory!=="" || budget!=="") SP +=` AND`
      else SP += ` WHERE`
      SP += ` difficulty = '${difficulty}'`;
    }

    let result = await db.any(SP);

    return result;
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
        // console.log(countResult.count);
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

 

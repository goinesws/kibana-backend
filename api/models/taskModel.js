const express = require("express");
const db = require("../../db");
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

  static async getTaskCategoryDetail(categoryId) {
    var result = {};

    let SPGetCategories = `select subcategory_id as id, name, description as desc, image as image_url from subcategory where category_id = '${categoryId}'`;

    result = await db.any(SPGetCategories);

    if (result.length == 0) return null;
    else return result;
  }

  static async getTaskCategories() {
    var result = {};

    let SPGetCategories = `select category_id as id, name, image from public.category`;

    result = await db.any(SPGetCategories);

    if (result.length == 0) {
      return null;
    }
  
    // get subcategories
    // get all the subcategories for each category
    for (let i = 0; i < result.length; i++) {
      let spGetSubcategories = `select subcategory_id as id, name from public.subcategory where category_id ='${result[i].id}'`;

      var subcatResult = {};

      subcatResult = await db.any(spGetSubcategories);

      // get amount based on subcat

      let count = 0;

      for (let j = 0; j < subcatResult.length; j++) {
        let spGetCount = `select count(*) from public.task where sub_category_id = '${subcatResult[j].id}'`;

        var countResult ={};
        
        countResult = await db.any(spGetCount);

        console.log(countResult);

        count +=  parseInt(countResult[0].count);
      }

      result[i].task_amount = count;
      result[i].sub_categories = subcatResult;
    }

    return result;
  }

  static async getTaskDetails (taskId) {
    let result = {};
    // SP buat task details
    let SPTaskDetails = `select task_id as id, name, tags, deadline as due_date, difficulty, price, description from public.task where "task_id" = '${taskId}';`;

    let temp_task_detail = await db.any(SPTaskDetails);

    result.task_detail = temp_task_detail[0];

    // SP buat get Client Details 
    let SPGetClient = `select public.client.client_id as id, profile_image as profile_image_url, public.client.name from public.client 
    join 
    public.task 
    on
    public.client.client_id = public.task.client_id
    and
    public.task.task_id = '${taskId}';`;

    let temp_client = await db.any(SPGetClient);

    result.client = temp_client[0];

    // SP buat get Registered Freelancer details (dari task enrollment di join)
    let SPGetRegisteredFreelancer = `select public.freelancer.freelancer_id as id, public.client.profile_image as profile_image_url, public.client.name
    from 
    public.client
    join 
    public.freelancer 
    on 
    public.freelancer.user_id = public.client.client_id
    join
    public.task_enrollment
    on 
    public.task_enrollment.freelancer_id = public.freelancer.freelancer_id
    join
    public.task
    on 
    public.task.task_id = public.task_enrollment.task_id
    and 
    public.task.task_id = '${taskId}';`;

    let temp_registered_freelancer = await db.any(SPGetRegisteredFreelancer);

    result.registered_freelancer = temp_registered_freelancer;

    // SP buat get reviews buat client
    let SPGetClientReviewList = `select public.client.name as name, rating as star, content as description, to_char(date, 'DD Month YYYY') as timestamp
    from 
    public.review
    join 
    public.task
    on
    public.task.client_id = public.review.destination_id
    join 
    public.freelancer
    on
    public.review.writer_id = public.freelancer.freelancer_id
    join
    public.client
    on 
    public.freelancer.user_id = public.client.client_id
    and
    public.task.task_id = '${taskId}'; `;

    let SPGetClientReviewRatingAmount = `select count(*) as rating_amount 
    from 
    public.review
    join 
    public.task
    on
    public.task.client_id = public.review.destination_id
    join 
    public.freelancer
    on
    public.review.writer_id = public.freelancer.freelancer_id
    join
    public.client
    on 
    public.freelancer.user_id = public.client.client_id
    and
    public.task.task_id = '${taskId}'; `;

    let SPGetClientAverageRating = `select round(avg(public.review.rating), 1) as average_rating
    from 
    public.review
    join 
    public.task
    on
    public.task.client_id = public.review.destination_id
    join 
    public.freelancer
    on
    public.review.writer_id = public.freelancer.freelancer_id
    join
    public.client
    on 
    public.freelancer.user_id = public.client.client_id
    and
    public.task.task_id = '${taskId}';`;

    let temp_res_get_client_client_review_list = await db.any(SPGetClientReviewList);
    let temp_res_get_client_review_rating_amount = await db.any(SPGetClientReviewRatingAmount);
    let temp_res_get_client_avg_rating = await db.any(SPGetClientAverageRating);

    result.review = {};

    result.review.average_rating = temp_res_get_client_avg_rating[0].average_rating;
    result.review.rating_amount = temp_res_get_client_review_rating_amount[0].rating_amount;
    result.review.review_list = temp_res_get_client_client_review_list;

    return result;
  }
}

 

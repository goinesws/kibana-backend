const express = require("express");
const db = require("../../db");
const Subcategory = require("../models/subcategoryModel");
const Category = require("../models/categoryModel");
const Freelancer = require("../models/freelancerModel");
const Review = require("../models/reviewModel");

module.exports = class Task {
	async getAllTaskDetail(task_id) {
		let SP = `select 
      task_id,
      sub_category_id,
      client_id,
      freelancer_id
      name,
      description,
      price,
      difficulty,
      tags,
      TO_CHAR(created_date, 'DD Mon YYYY') from task where task_id = '${task_id}'`;

		let result = await db.any(SP);

		return result;
	}

	async getTaskList(body) {
		const searchText = body["search_text"];
		const subcategory = body["sub_category"];
		const budget = body["budget"];
		const difficulty = body["difficulty"];
		const lastId = body["last_id"];

		let SP = `SELECT task_id as id, name, description, tags, deadline as due_date, difficulty, price FROM public.task`;

		if (searchText !== "" && searchText) {
			SP += ` WHERE (name || description ILIKE '%${searchText}%'
      OR '${searchText}' ILIKE ANY (tags))`;
		}
		if (subcategory !== "" && subcategory) {
			if (searchText !== "") SP += ` AND`;
			else SP += ` WHERE`;
			SP += ` sub_category_id = '${subcategory}'`;
		}
		if (budget !== "" && budget) {
			const budgetObject = JSON.parse(budget);
			const budgetStart = budgetObject.budget_start;
			const budgetEnd = budgetObject.budget_end;

			if ((searchText !== "" && searchText) || (subcategory !== "" && subcategory)) SP += ` AND`;
			else SP += ` WHERE`;
			if (budget.budget_end !== null) {
				SP += ` price BETWEEN '${budgetStart}' AND '${budgetEnd}'`;
			} else {
				SP += ` price > '${budgetStart}'`;
			}
		}

		if (difficulty !== "" && difficulty) {
			if ((searchText !== "" && searchText) || (subcategory !== "" && subcategory) || (budget !== "" && budget))
				SP += ` AND`;
			else SP += ` WHERE`;
			SP += ` difficulty = '${difficulty}'`;
		}

		let result = await db.any(SP);

		return result;
	}

	async getNewTaskByCategory(categoryId) {
		// get list of SUBCAT BY CATEGORY ID
		const subcatInstance = new Subcategory();
		let subcat_list = await subcatInstance.getListSubcatByCategoryID(
			categoryId
		);

		// console.log(subcat_list);

		let SPGetTask = `select task_id as id, name, description, tags, deadline as due_date, difficulty, price from public.task where sub_category_id in 
    ${subcat_list} and status = 'ChooseFreelancer' order by deadline ASC limit 4;`;

		// console.log(SPGetTask);

		let result = await db.any(SPGetTask);

		// console.log(result);
		// dari resultnya dijadiin ke constructornya dlu
		return result;
	}

	async getTaskCategoryDetail(categoryId) {
		const subcatInstance = new Subcategory();
		let result = await subcatInstance.getSubcatByCategoryID(categoryId);

		if (result.length == 0) return null;
		else return result;
	}

	async getTaskCategories() {
		// const subcatInstance = new Subcategory();
		// let result = await Category.getAllCategoriesForTask();
		// // console.log(result);
		// if (result.length == 0) {
		// 	return null;
		// }
		// // get subcategories
		// // get all the subcategories for each category
		// for (let i = 0; i < result.length; i++) {
		// 	let subcatResult = await subcatInstance.getSubcatLiteByCategoryID(
		// 		result[i].id
		// 	);

		// 	// console.log('Subcat Result');
		// 	// console.log(subcatResult);
		// 	// get amount based on subcat
		// 	let count = 0;
		// 	for (let j = 0; j < subcatResult.length; j++) {
		// 		let countResult = await subcatInstance.getSubcatCountByID(
		// 			subcatResult[j].id
		// 		);
		// 		// console.log('Count Result di Task Model');
		// 		// console.log(countResult.count);
		// 		count += parseInt(countResult.count);
		// 	}
		// 	result[i].task_amount = count;
		// 	result[i].sub_categories = subcatResult;
		// }
		let SP = `
    
    `;

		try {
			let result = db.any(SP);

			return result;
		} catch (error) {
			return new Error("Cannot Get Categories");
		}
		return result;
	}

	async getTaskDetails(taskId) {
		let result = {};
		// SP buat task details
		let SPTaskDetails = `select task_id as id, name, tags, deadline as due_date, difficulty, price, description 
    from public.task where "task_id" = '${taskId}';`;

		let temp_task_detail = await db.any(SPTaskDetails);

		result.task_detail = temp_task_detail[0];

		let SPGetClient = `select public.client.client_id as id, profile_image as profile_image_url, public.client.name from public.client 
    join 
    public.task 
    on
    public.client.client_id = public.task.client_id
    and
    public.task.task_id = '${taskId}';`;

		let temp_client = await db.any(SPGetClient);

		result.client = temp_client;

		let temp_registered_freelancer = await Freelancer.getFreelancerByTaskID(
			taskId
		);

		result.registered_freelancer = temp_registered_freelancer;

		let temp_res_get_client_client_review_list =
			await Review.getClientReviewByTaskID(taskId);
		let temp_res_get_client_review_rating_amount =
			await Review.getClientReviewRatingAmountByTaskID(taskId);
		let temp_res_get_client_avg_rating =
			await Review.getClientAvgRatingByTaskID(taskId);

		result.review = {};

		result.review.average_rating =
			temp_res_get_client_avg_rating.average_rating;
		result.review.rating_amount =
			temp_res_get_client_review_rating_amount.rating_amount;
		result.review.review_list = temp_res_get_client_client_review_list;

		console.log(result);

		return result;
	}

	async getTaskByClientId(userId) {
		let SP = `
    select 
    task_id as id,
    name,
    description,
    tags,
    deadline as due_date,
    difficulty,
    price
    from 
    public.task
    where
    client_id = '${userId}'
    and
    status = '1';
    `;

		let result = await db.any(SP);

		return result;
	}

	async createTask(data, userId) {
		let subcat = data.subcategory;
		let name = data.name;
		let price = data.price;
		let difficulty = data.difficulty;
		let tags = data.tags;
		let deadline = data.deadline;

		let SP = `
		insert into
		public.task
		(task_id, sub_category_id, client_id, name, price, difficulty, tags, deadline)
		values
		(
		CONCAT('TASK', (select nextval('task_id_sequence'))),
		'${subcat}',
		'${userId}',
		'${name}',
		${price},
		'${difficulty}',
		'{${tags}}',
		'${deadline}'
		)
		`;

		try {
			console.log(SP);
			let result = await db.any(SP);
			return result;
		} catch (error) {
			return new Error("Gagal Insert.");
		}
	}

	async getOwnedTask(userId) {
		let SP = `
    select 
    t.task_id as id,
    t.name as name,
    t.tags as tags,
    t.deadline as due_date,
    t.price as price,
    tr.status as status,
    tr.delivery_date as delivery_date,
    CASE 
      WHEN (select status from public.transaction where project_id = t.task_id) = '1' 
      OR (select status from public.transaction where project_id = t.task_id) = '6'
      THEN
      (select count(*) from public.task_enrollment where task_id in (select task_id from public.task 
      where client_id = t.client_id))
      ELSE null
    END registered_freelancer_amount,
    CASE 
      WHEN (select status from public.transaction where project_id = t.task_id) != '1' 
      OR (select status from public.transaction where project_id = t.task_id) != '6'
      THEN
      (select row_to_json(t)
      from 
      (
      select f.freelancer_id as id, c.name, c.profile_image as profile_image_url 
      from public.freelancer f join public.client c on f.user_id = c.client_id
      where f.freelancer_id = t.freelancer_id
      ) 
      t)
      ELSE null
    END chosen_freelancer,
    tr.transaction_id as transaction_id,
    CASE 
      WHEN (select count(*) from public.review where destination_id = t.task_id) >= 1 THEN true
      ELSE false
    END is_reviewed,
    CASE 
      WHEN (select count(*) from public.review where destination_id = t.task_id) >= 1 
      THEN 
      (select row_to_json(t)
      from 
      (
      select count(*) as amount
      from 
      public.review
      where
      destination_id = t.task_id
      ) 
      t)
      ELSE null
    END review
    from 
    public.task t
    join
    public.transaction tr
    on
    tr.project_id = t.task_id
    where
    t.client_id = '${userId}'
    `;

		try {
			let result = await db.any(SP);

			return result;
		} catch (error) {
			return new Error("Gagal mendapatkan task");
		}
	}

	async getOwnedTaskDetails(taskId, userId) {
		let SP = `
    select 
    t.task_id as id,
    t.name as name,
    t.tags as tags,
    t.deadline as due_date,
    t.difficulty as difficulty,
    t.price as price,
    tr.status as status
    from 
    public.task t
    join
    public.transaction tr
    on
    t.task_id = tr.project_id
    where
    t.task_id = '${taskId}'
    and
    t.client_id = '${userId}';
    `;

		try {
			let result = await db.any(SP);

			return result;
		} catch (error) {
			return new Error("Gagal Mengambil Task.");
		}
	}

	async getRegisteredFreelancer(taskId, userId) {
		// choose due date masih harus di confirm
		let SP = `
    select 
    deadline as choose_due_date,
    (
      select json_agg(t)
      from 
      (
        select 
        f.freelancer_id as id,
        c.name as name,
        c.profile_image as profile_image_url,
        f.description as description,
        f.portfolio as portfolio_url,
        f.cv as cv_url
        from
        public.freelancer f
        join
        task_enrollment te
        on
        te.freelancer_id = f.freelancer_id
        join
        public.client c 
        on
        c.client_id = f.user_id
        group by id, name, profile_image_url
      ) t
    ) registered_freelancer
    from 
    public.task
    where
    task_id = '${taskId}'
    and
    client_id = '${userId}'
    `;

		try {
			let result = await db.any(SP);

			return result[0];
		} catch (error) {
			return new Error("Gagal mengambil data.");
		}
	}

	async deleteTask(taskId, userId) {
		let SP = `
      delete 
      from 
      public.task
      where task_id = '${taskId}'
      and 
      client_id = '${userId}';
    `;

		try {
			let result = await db.any(SP);

			return result;
		} catch (error) {
			return new Error("Gagal Menghapus Tugas.");
		}
	}

	async getTaskHistory(userId) {
		let SP = `
    select 
    t.task_id as id,
    t.name as name,
    t.tags as tags,
    t.deadline as due_date,
    t.difficulty as difficulty,
    t.price as price,
    tr.status as status, 
    tr.delivery_date as delivery_date,
    CASE 
      WHEN tr.status = '1' or tr.status = '10'
      THEN (select count(*) from public.task_enrollment where task_id = t.task_id)
    END registered_freelancer_amount,
    (
      select to_json(t)
      from 
      (
        select client_id as id, name, profile_image as profile_image_url
        from 
        public.client
        where 
        client_id = t.client_id
      )t
    ) client,
    CASE
      WHEN tr.status != '1' or tr.status != '10'
      THEN tr.transaction_id 
      ELSE null
    END transaction_id, 
    CASE
      WHEN tr.status = '4' AND (select count(*) from public.review where destination_id = t.task_id) >= 1
      THEN true
      ELSE false
    END is_reviewed,
    CASE 
      WHEN tr.status = '4' AND (select count(*) from public.review where destination_id = t.task_id) >= 1
      THEN 
      (
        select to_json(t)
        from 
        (
          select count(*) as amount
          from
          public.review 
          where 
          destination_id = t.task_id
        )t
      )
      ELSE null
    END review
    from  
    public.task t
    join
    public.transaction tr
    on 
    t.task_id = tr.project_id
    where 
    t.freelancer_id = '${userId}'`;

		try {
			let result = await db.any(SP);

			return result;
		} catch (error) {
			return new Error("Gagal mendapatkan data.");
		}
	}

	async getTaskHistoryDetails(taskId, userId) {
		let SP = `
    select 
    t.task_id as id,
    t.name as name,
    t.tags as tags,
    t.deadline as due_date,
    t.difficulty as difficulty,
    t.price as price,
    tr.status as status
    from
    public.task t
    join
    public.transaction tr
    on
    t.task_id = tr.project_id
    where 
    t.task_id = '${taskId}'
    and
    t.freelancer_id = '${userId}'
    `;

		try {
			let result = await db.any(SP);

			return result[0];
		} catch (error) {
			return new Error("Gagal mendapatkan data.");
		}
	}
};

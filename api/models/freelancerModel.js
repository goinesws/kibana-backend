const express = require("express");
const db = require("../../db");
const Order = require("../models/orderModel");

module.exports = class Freelancer {
	async getFreelancerByTaskID(taskId) {
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

		let result = await db.any(SPGetRegisteredFreelancer);

		return result;
	}

	async isFreelancer(userId) {
		let SPGetIsFreelancer = `select count(*) from public.freelancer where user_id = '${userId}';`;

		let result = await db.any(SPGetIsFreelancer);

		if (result[0].count > 0) {
			return true;
		} else {
			return false;
		}
	}

	async getDesc(userId) {
		let SP = `select description from public.freelancer where user_id='${userId}'`;

		let result = await db.any(SP);

		return result[0];
	}

	async getEducationHistory(userId) {
		let SP = `
    select degree, major, university, country, year as graduation_year from public.education p
    join
    public.freelancer f
    on
    p.freelancer_id = f.freelancer_id
    where
    f.user_id = '${userId}'
    `;

		let result = await db.any(SP);

		return result;
	}

	async getSkill(userId) {
		let SP = `select skills from public.freelancer where user_id = '${userId}';`;

		console.log(SP);

		let result = await db.any(SP);

		return result[0].skills;
	}

	async getCV(userId) {
		let SP = `
    select cv as cv_url from public.freelancer where user_id = '${userId}';
    `;

		let result = await db.any(SP);

		return result[0];
	}

	async getPortfolio(userId) {
		let SP = `
    select portfolio as portfolio_url from public.freelancer where user_id = '${userId}';
    `;

		let result = await db.any(SP);
		console.log(result[0]);

		return result[0];
	}

	async getOwnedService(userId) {
		let SPGetService = `select s.service_id as id, s.images as image_url, s.name, s.tags, s.price, s.working_time from public.service s 
    join 
    public.freelancer f 
    on 
    f.freelancer_id = s.freelancer_id
    where 
    f.user_id = '${userId}'; `;

		let SPGetFreealancer = `select profile_image as profile_image_url, name from public.client where client_id = '${userId}';`;

		let result = await db.any(SPGetService);

		let resultFreelancer = await db.any(SPGetFreealancer);

		for (var i = 0; i < result.length; i++) {
			console.log("hi");
			let serviceId = result[i].id;

			let SPGetReviewTotal = `select count(*) from public.review where destination_id = '${serviceId}';`;
			let SPGetReviewAverage = `select round(avg(rating), 1) as avg from public.review where destination_id = '${serviceId}';`;
			result[i].freelancer = resultFreelancer[0];
			let avg_placeholder = await db.any(SPGetReviewAverage);
			result[i].average_rating = avg_placeholder[0].avg;
			let amt_placeholder = await db.any(SPGetReviewTotal);
			result[i].rating_amount = amt_placeholder[0].count;
		}

		// console.log(result);

		return result;
	}

	async getFreelancerByServiceId(serviceId) {
		let SPGetRegisteredFreelancer = `select public.freelancer.freelancer_id as id, public.client.profile_image as profile_image_url, public.client.name, freelancer.description
    from 
    public.client
    join 
    public.freelancer 
    on 
    public.freelancer.user_id = public.client.client_id
	join
	service on service.freelancer_id = freelancer.freelancer_id
   	where
    service.service_id = '${serviceId}';`;

		let result = await db.any(SPGetRegisteredFreelancer);

		return result[0];
	}

	async getFreelancerAverageRating(userId) {
		let SP = `
    select 
    avg(r.rating)
    from 
    public.review r
    join 
    public.order o
    on
    r.transaction_id = o.order_id
    join
    public.service s
    on
    o.service_id = s.service_id
    join
    public.freelancer f
    on
    s.freelancer_id = f.freelancer_id
    where
    f.user_id = '${userId}';
    `;

		let result = await db.any(SP);

		return result[0].avg;
	}

	async getFreelancerTotalProject(userId) {
		let SP = `select 
    count(*)
    from 
    public.review r
    join 
    public.order o
    on
    r.transaction_id = o.order_id
    join
    public.service s
    on
    o.service_id = s.service_id
    join
    public.freelancer f
    on
    s.freelancer_id = f.freelancer_id
    where
    f.user_id = '${userId}';`;

		let result = await db.any(SP);

		return result[0].count;
	}

	async getProjectHistory(userId) {
		let result = {};

		result.average_rating = await this.getFreelancerAverageRating(userId);
		result.project_amount = await this.getFreelancerTotalProject(userId);
		result.project_list = await Order.getFreelancerProjectByUserId(userId);

		console.log(result);

		return result;
	}

	async editDescription(userId, description) {
		let SP = `UPDATE public.freelancer set description = '${description}' where user_id = '${userId}';`;

		console.log(SP);

		let result = await db.any(SP);

		return result;
	}

	async editFreelancerEducation(userId, education) {
		// ini SP buat insert educationHistory
		let SP = ``;

		let result = await db.any(SP);

		return result;
	}

	async editFreelancerSkills(userId, skill) {
		let SP = `
		UPDATE  
		public.freelancer 
		set
		skills = '${skill}'
		where
		user_id = '${userId}'`;

		console.log(SP);

		let result = await db.any(SP);

		return result;
	}

	// pake multer buat file
	async editFreelancerCV() {}

	// pake multer buat file
	async editFreelancerPortfolio() {}
};

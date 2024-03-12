const express = require("express");
const db = require("../../db");
const Review = require("../models/reviewModel");
const Task = require("../models/taskModel");
const Freelancer = require("../models/freelancerModel");

module.exports = class Client {
	async getClientByTaskID(taskId) {
		// SP buat get Client Details
		let SPGetClient = `select public.client.client_id as id, profile_image as profile_image_url, public.client.name from public.client 
    join 
    public.task 
    on
    public.client.client_id = public.task.client_id
    and
    public.task.task_id = '${taskId}';`;

		let result = await db.any(SPGetClient);

		console.log("Hasil : ");
		console.log(result);

		return result[0];
	}

	async getOtherClientProfile(userId) {
		let SPGetClientDetails = `select client_id as id, profile_image as profile_image_url, name, username from public.client 
    where client_id = '${userId}'; `;

		let result = await db.any(SPGetClientDetails);

		return result[0];
	}

	static async getClientReview(userId) {
		let result = {};
		let review = await Review.getClientReviewByUserId(userId);

		let average_rating = await Review.getClientAverageRatingByUserId(userId);

		let rating_amount = await Review.getClientReviewRatingAmountByUserId(
			userId
		);

		result.average_rating = average_rating;
		result.rating_amount = rating_amount;
		result.review_list = review;

		return result;
	}

	async getClientTask(userId) {
		let result = await Task.getTaskByClientId(userId);

		return result;
	}

	async register(data, cv_url, port_url, userId) {
		// manggil freelancer buat create freelancer instance

		let freelancerInstance = new Freelancer();
		// bikin freelancer based on data

		let skills = data.skills.toString();
		console.log(skills);
		let create_result = await freelancerInstance.createFreelancer(
			userId,
			data.description,
			cv_url,
			port_url,
			skills
		);

		if (create_result instanceof Error) {
			return new Error("Gagal Mendaftar.");
		}

		// bikin education and link it to freelancer
		data.education_history.forEach(async (ed) => {
			console.log("Insert ED");
			let education_result = await freelancerInstance.insertFreelancerEducation(
				userId,
				ed
			);

			if (education_result instanceof Error) {
				return new Error("Gagal Mendaftar.");
			}
		});

		return 0;
	}
};

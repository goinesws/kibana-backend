const express = require("express");
const app = express();
const Review = require("../models/reviewModel.js");

app.insertReviewClient = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	if (
		req.get("X-Token") == req.session.id &&
		req.session.is_freelancer == true
	) {
		let freelancerId = req.session.freelancer_id;
		let data = req.body;
		let reviewInstance = new Review();
		let review_insert_result = reviewInstance.insertClientReview(
			freelancerId,
			data
		);

		if (review_insert_result instanceof Error) {
			result.error_schema = {
				error_code: 903,
				error_mesage: "Insert Gagal.",
			};
			result.output_schema = {};
		} else {
			result.error_schema = {
				error_code: 200,
				error_mesage: "Sukses.",
			};
			result.output_schema = {};
		}
		res.send(result);
	} else {
		result.error_schema = {
			error_code: 403,
			error_mesage:
				"Anda tidak memiliki hak akses untuk melakukan hal tersebut.",
		};
		result.output_schema = {};
		res.send(result);
		return;
	}
};

app.insertReviewFreelancer = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	if (req.get("X-Token") == req.session.id) {
		let userId = req.session.client_id;
		let data = req.body;
		let reviewInstance = new Review();
		let review_insert_result = reviewInstance.insertFreelancerReview(
			userId,
			data
		);

		if (review_insert_result instanceof Error) {
			result.error_schema = {
				error_code: 903,
				error_mesage: "Insert Gagal.",
			};
			result.output_schema = {};
		} else {
			result.error_schema = {
				error_code: 200,
				error_mesage: "Sukses.",
			};
			result.output_schema = {};
		}
		res.send(result);
	} else {
		result.error_schema = {
			error_code: 403,
			error_mesage:
				"Anda tidak memiliki hak akses untuk melakukan hal tersebut.",
		};
		result.output_schema = {};
		res.send(result);
		return;
	}
};

app.insertReviewService = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	if (req.get("X-Token") == req.session.id) {
		let userId = req.session.client_id;
		let data = req.body;
		let reviewInstance = new Review();
		let review_insert_result = reviewInstance.insertServiceReview(userId, data);

		if (review_insert_result instanceof Error) {
			result.error_schema = {
				error_code: 903,
				error_mesage: "Insert Gagal.",
			};
			result.output_schema = {};
		} else {
			result.error_schema = {
				error_code: 200,
				error_mesage: "Sukses.",
			};
			result.output_schema = {};
		}
		res.send(result);
	} else {
		result.error_schema = {
			error_code: 403,
			error_mesage:
				"Anda tidak memiliki hak akses untuk melakukan hal tersebut.",
		};
		result.output_schema = {};
		res.send(result);
		return;
	}
};

module.exports = app;

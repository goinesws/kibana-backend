const express = require("express");
const app = express();
const Client = require("../models/clientModel.js");
const Freelancer = require("../models/freelancerModel.js");

app.getClientReview = async (req, res) => {
	let result = {};
	let userId = req.params.userId;

	result.error_schema = {};
	result.output_schema = {};

	const clientInstance = new Client();
	let client_review = await clientInstance.getClientReview(userId);

	if (client_review == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Tidak ada data yang ditemukan.",
		};
		result.output_schema = {};
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema = client_review;
	}

	res.send(result);
};

app.getClientTask = async (req, res) => {
	let result = {};
	let userId = req.params.userId;

	result.error_schema = {};
	result.output_schema = {};

	const clientInstance = new Client();
	let task = await clientInstance.getClientTask(userId);

	if (task == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Tidak ada data yang ditemukan.",
		};
		result.output_schema = {};
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema.tasks = task;
	}

	res.send(result);
};

app.registerAsFreelancer = async (req, res) => {};

module.exports = app;

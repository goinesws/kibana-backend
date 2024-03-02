const express = require("express");
const app = express();
const Freelancer = require("../models/freelancerModel.js");

app.getFreelancerDescription = async (req, res) => {
	let result = {};
	let userId = req.params.userId;

	result.error_schema = {};
	result.output_schema = {};

	let freelancerInstance = new Freelancer();
	let desc = await freelancerInstance.getDesc(userId);

	if (desc == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Tidak ada data yang ditemukan.",
		};
		result.output_schema = null;
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema = desc;
	}

	res.send(result);
};

app.getFreelancerEducationHistory = async (req, res) => {
	let result = {};
	let userId = req.params.userId;

	result.error_schema = {};
	result.output_schema = {};

	let freelancerInstance = new Freelancer();
	let edu = await freelancerInstance.getEducationHistory(userId);

	console.log(edu);

	if (edu == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Tidak ada data yang ditemukan.",
		};
		result.output_schema.education_history = null;
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema.education_history = edu;
	}

	return res.send(result);
};

app.getFreelancerSkill = async (req, res) => {
	let result = {};
	let userId = req.params.userId;

	result.error_schema = {};
	result.output_schema = {};

	let freelancerInstance = new Freelancer();
	let skills = await freelancerInstance.getSkill(userId);

	if (skills == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Tidak ada data yang ditemukan.",
		};
		result.output_schema.skills = null;
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema.skills = skills;
	}

	res.send(result);
};

app.getFreelancerCV = async (req, res) => {
	let result = {};
	let userId = req.params.userId;

	result.error_schema = {};
	result.output_schema = {};

	let freelancerInstance = new Freelancer();
	let CV = await freelancerInstance.getCV(userId);

	if (CV == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Tidak ada data yang ditemukan.",
		};
		result.output_schema = null;
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema = CV;
	}

	res.send(result);
};

app.getPortfolio = async (req, res) => {
	let result = {};
	let userId = req.params.userId;

	result.error_schema = {};
	result.output_schema = {};

	let freelancerInstance = new Freelancer();
	let portfolio = await freelancerInstance.getPortfolio(userId);

	if (portfolio == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Tidak ada data yang ditemukan.",
		};
		result.output_schema = null;
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema = portfolio;
	}

	res.send(result);
};

app.getOwnedService = async (req, res) => {
	let result = {};
	let userId = req.params.userId;

	result.error_schema = {};
	result.output_schema = {};

	let freelancerInstance = new Freelancer();
	let owned_service = await freelancerInstance.getOwnedService(userId);

	if (result == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Tidak ada data yang ditemukan.",
		};
		result.output_schema = null;
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema = owned_service;
	}

	res.send(result);
};

app.getFreelancerProjectHistory = async (req, res) => {
	let result = {};
	let userId = req.params.userId;

	result.error_schema = {};
	result.output_schema = {};

	let freelancerInstance = new Freelancer();
	let projects = await freelancerInstance.getProjectHistory(userId);

	if (projects == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Tidak ada data yang ditemukan.",
		};
		result.output_schema = null;
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema = projects;
	}

	res.send(result);
};

app.editFreelancerDescription = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	let userId = ``;
	console.log(req.session.id);
	console.log(req.get("X-Token"));
	if (req.session.id == req.get("X-Token") && req.session.is_freelancer) {
		userId = req.session.client_id;
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki akses untuk hal tersebut.",
		};
		result.output_schema = {};
		res.send(result);
		return;
	}
	let description = req.body.description;
	let freelancerInstance = new Freelancer();
	let edit_result = await freelancerInstance.editDescription(
		userId,
		description
	);

	if (edit_result == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Edit tidak dapat dilakukan.",
		};
		result.output_schema = {};
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema = edit_result;
	}

	res.send(result);
};

app.editFreelancerSkills = async (req, res) => {
	// get user_id dari session token
	// dari user_id merge ama fl get fl_id
	// dari fl_id
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	let skills = JSON.stringify(req.body.skills);
	console.log(skills);
	skills = skills.replace("[", "{");
	skills = skills.replace("]", "}");

	if (req.session.id == req.get("X-Token") && req.session.is_freelancer) {
		userId = req.session.client_id;
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki akses untuk hal tersebut.",
		};
		result.output_schema = {};
		res.send(result);
		return;
	}

	let freelancerInstance = new Freelancer();
	let edit_result = await freelancerInstance.editFreelancerSkills(
		userId,
		skills
	);

	if (edit_result == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Edit tidak dapat dilakukan.",
		};
		result.output_schema = {};
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema = edit_result;
	}

	res.send(result);
};

app.editFreelancerEducation = async (req, res) => {};

module.exports = app;

const express = require("express");
const app = express();
const Freelancer = require("../models/freelancerModel.js");
var multer = require("multer");

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

	console.log(req.session.id);
	console.log(req.get("X-Token"));
	if (req.session.id == req.get("X-Token") && req.session.is_freelancer) {
		let userId = req.session.client_id;
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
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki akses untuk hal tersebut.",
		};
		result.output_schema = {};
		res.send(result);
		return;
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

	if (req.session.id == req.get("X-Token") && req.session.is_freelancer) {
		let userId = req.session.client_id;
		let skills = JSON.stringify(req.body.skills);
		console.log(skills);
		skills = skills.replace("[", "{");
		skills = skills.replace("]", "}");
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
			result.output_schema = {};
		}
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki akses untuk hal tersebut.",
		};
		result.output_schema = {};
		res.send(result);
		return;
	}

	res.send(result);
};

app.editFreelancerEducation = async (req, res) => {
	// get userId dari req.session
	// dari userId get freelancerId
	// dari freelancerId insert ke education?

	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	let education = req.body.education_history;
	console.log(education);

	if (req.session.id == req.get("X-Token") && req.session.is_freelancer) {
		let userId = req.session.client_id;
		let freelancerInstance = new Freelancer();
		console.log(education.length);

		education.map((education) => {
			let ed_result = freelancerInstance.editFreelancerEducation(
				userId,
				education
			);

			if (ed_result == null) {
				result.error_schema = {
					error_code: 903,
					error_message: "Edit tidak dapat dilakukan.",
				};
				result.output_schema = {};

				res.send(result);
				return;
			}
		});

		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema = {};
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki akses untuk hal tersebut.",
		};
		result.output_schema = {};
		res.send(result);
		return;
	}

	res.send(result);
};

app.editFreelancerCV = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	console.log(req.files);
	console.log(req.body.data);

	// cek session id ama x-token + cek if freelancer
	if (req.session.id == req.get("X-Token") && req.session.is_freelancer) {
		let userId = req.session.client_id;
		let freelancerInstance = new Freelancer();
		let images = [];

		images.push(await freelancerInstance.addFreelancerImage(req.files["cv"]));

		console.log(images);
		images = images.map((link) => link.replace(/"/g, ""));

		let cv_result = await freelancerInstance.editFreelancerCV(
			userId,
			images[0]
		);

		if (cv_result instanceof Error) {
			result.error_schema = {
				error_code: 903,
				error_message: "Edit tidak dapat dilakukan.",
			};
			result.output_schema = {};
			res.send(result);
			return;
		} else {
			result.error_schema = { error_code: 200, error_message: "Sukses" };
			result.output_schema = {};
			res.send(result);
		}
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki akses untuk hal tersebut.",
		};
		result.output_schema = {};
		res.send(result);
		return;
	}
};

app.editFreelancerPortfolio = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	if (req.session.id == req.get("X-Token") && req.session.is_freelancer) {
		let userId = req.session.client_id;
		let freelancerInstance = new Freelancer();
		let images = [];

		images.push(
			await freelancerInstance.addFreelancerImage(req.files["portfolio"])
		);

		console.log(images);
		images = images.map((link) => link.replace(/"/g, ""));

		let port_result = await freelancerInstance.editFreelancerPortfolio(
			userId,
			images[0]
		);

		if (port_result instanceof Error) {
			result.error_schema = {
				error_code: 903,
				error_message: "Edit tidak dapat dilakukan.",
			};
			result.output_schema = {};
			res.send(result);
			return;
		} else {
			result.error_schema = { error_code: 200, error_message: "Sukses" };
			result.output_schema = {};
			res.send(result);
		}
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki akses untuk hal tersebut.",
		};
		result.output_schema = {};
		res.send(result);
		return;
	}
};

module.exports = app;

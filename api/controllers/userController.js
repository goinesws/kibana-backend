const express = require("express");
const app = express();
const User = require("../models/userModel");
const Client = require("../models/clientModel.js");
const Freelancer = require("../models/freelancerModel.js");

app.loginFunction = async (req, res) => {
	const username = req.body.username_email;
	const password = req.body.password;

	let login_info = await User.getLoginInfo(username, password);

	let failed = false;
	let curr_client_id = "";
	if (login_info == null || login_info == undefined) {
		failed = true;
	} else {
		curr_client_id = await User.getClientID(username);
	}

	result = {};

	if (failed) {
		result.error_schema = { error_code: 999, error_message: "Login Gagal." };
		result.output_schema = {};
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses." };
		result.output_schema = login_info;
		result.output_schema.token = req.session.id;
		req.session.client_id = curr_client_id;
		req.session.is_freelancer = login_info.is_freelancer;
		req.session.freelancer_id = login_info.freelancer_id;
	}

	res.send(result);
};

app.registerFunction = async (req, res) => {
	const email = req.body.email;
	const username = req.body.username;
	const name = req.body.name;
	const phone = req.body.phone_number;
	const password = req.body.password;

	output_schema = await User.registerAsClient(
		email,
		username,
		name,
		phone,
		password
	);

	result = {};

	if (output_schema == null) {
		result.error_schema = {
			error_code: 999,
			error_message: "Registrasi Gagal.",
		};
		result.output_schema = {};
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses." };
		result.output_schema = output_schema;
	}

	res.send(result);
};

app.registerFreelancerFunction = async (req, res) => {
	const freelancer = req.body.freelancer;
	const username = req.body.username;

	output_schema = await User.registerAsFreelancer(freelancer, username);

	result = {};

	if (output_schema == null) {
		result.error_schema = {
			error_code: 999,
			error_message: "Registration Failed.",
		};
		result.output_schema = {};
	} else {
		result.error_schema = { error_code: 200, error_message: "Success" };
		result.output_schema = output_schema;
	}

	res.send(result);
};

app.logoutFunction = async (req, res) => {
	let result = {};

	if (req.session.id == req.get("X-Token")) {
		console.log("Logout");
		req.session.destroy();

		result.error_schema = { error_code: 200, error_message: "Success" };
		result.output_schema = {};
	} else {
		result.error_schema = { error_code: 999, error_message: "Logout Failed." };
		result.output_schema = {};
	}

	res.send(result);
};

app.getOtherProfile = async (req, res) => {
	let result = {};
	let userId = req.params.userId;

	result.error_schema = {};
	result.output_schema = {};

	let clientDetails = await Client.getOtherClientProfile(userId);
	let isFreelancer = await Freelancer.isFreelancer(userId);

	if (clientDetails == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Tidak ada data yang ditemukan.",
		};
		result.output_schema = null;
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema = clientDetails;
		result.output_schema.isFreelancer = isFreelancer;
	}

	res.send(result);
};

app.getMyProfile = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	let me;
	if (req.get("X-Token") == req.session.id) {
		me = await User.getMyProfile(req.session.client_id);
		if (me == null) {
			result.error_schema = {
				error_code: 903,
				error_message: "Tidak ada data yang ditemukan.",
			};
			result.output_schema = null;
		} else {
			result.error_schema = { error_code: 200, error_message: "Sukses" };
			result.output_schema = me;
		}
	} else {
		result.error_schema = { error_code: 403, error_message: "Forbidden." };
		result.output_schema = null;
	}

	res.send(result);
};

app.getMyBankDetails = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	let bank;
	if (req.get("X-Token") == req.session.id) {
		bank = await User.getBankDetails(req.session.client_id);
		if (bank == null) {
			result.error_schema = {
				error_code: 903,
				error_message: "Tidak ada data yang ditemukan.",
			};
			result.output_schema = null;
		} else {
			result.error_schema = { error_code: 200, error_message: "Sukses" };
			result.output_schema.bank_details = bank;
		}
	} else {
		result.error_schema = { error_code: 403, error_message: "Forbidden." };
		result.output_schema = null;
	}

	res.send(result);
};

app.editMyProfile = async (req, res) => {
	// harus get session-id dari req
	// ini pakai params dari body isiannya
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	console.log(req.session.id);
	console.log(req.get("X-Token"));

	if (req.session.id == req.get("X-Token")) {
	} else {
		result.error_schema = { error_code: 403, error_message: "Forbidden." };
		result.output_schema = null;
	}

	res.send(result);
};

app.editBankDetails = async (req, res) => {
	// harus get session-id buat cocokin
	// ini pakai params dari body isiannya
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	// console.log(req.session.id);
	// console.log(req.get("X-Token"));

	if (req.session.id == req.get("X-Token")) {
		// console.log(req.body);
		try {
			let change = await User.editBankDetails(req.session.client_id, req.body);
			result.error_schema = { error_code: 200, error_message: "Success." };
			result.output_schema = {};
		} catch {
			result.error_schema = { error_code: 999, error_message: "Gagal." };
			result.output_schema = {};
		}
	} else {
		result.error_schema = { error_code: 403, error_message: "Forbidden." };
		result.output_schema = {};
	}

	res.send(result);
};

module.exports = app;

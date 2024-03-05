const express = require("express");
const app = express();
const User = require("../models/userModel");
const Client = require("../models/clientModel.js");
const Freelancer = require("../models/freelancerModel.js");

// done refactor
app.loginFunction = async (req, res) => {
	const username = req.body.username_email;
	const password = req.body.password;

	const userInstance = new User();
	// let login_info = await userInstance.getLoginInfo(username, password);

	// let failed = false;
	// let curr_client_id = "";
	// if (login_info == null || login_info == undefined) {
	// 	failed = true;
	// } else {
	// 	curr_client_id = await userInstance.getClientID(username);
	// }

	let login_info = await userInstance.login(username, password);

	result = {};

	console.log(login_info);

	if (
		login_info instanceof Error ||
		login_info == null ||
		login_info == undefined
	) {
		result.error_schema = { error_code: 999, error_message: "Login Gagal." };
		result.output_schema = {};
	} else {
		req.session.client_id = login_info.id;
		req.session.is_freelancer = login_info.is_freelancer;
		req.session.freelancer_id = login_info.freelancer_id;

		// remove freelancer_id dari login_info
		delete login_info["freelancer_id"];

		console.log(req.session.is_freelancer);
		console.log(req.session.freelancer_id);
		console.log(req.session.client_id);

		result.error_schema = { error_code: 200, error_message: "Sukses." };
		result.output_schema = login_info;
		result.output_schema.token = req.session.id;
		req.session.username = login_info.username;
	}

	res.send(result);
};

// done refactor
app.registerFunction = async (req, res) => {
	const email = req.body.email;
	const username = req.body.username;
	const name = req.body.name;
	const phone = req.body.phone_number;
	const password = req.body.password;

	// old Code
	// output_schema = await userInstance.registerAsClient(
	// 	email,
	// 	username,
	// 	name,
	// 	phone,
	// 	password
	// );

	// result = {};

	// if (output_schema == null) {
	// 	result.error_schema = {
	// 		error_code: 999,
	// 		error_message: "Registrasi Gagal.",
	// 	};
	// 	result.output_schema = {};
	// } else {
	// 	result.error_schema = { error_code: 200, error_message: "Sukses." };
	// 	result.output_schema = output_schema;
	// }

	// new Code
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	const userInstance = new User();
	let register_result = await userInstance.register(
		email,
		username,
		name,
		phone,
		password
	);

	if (register_result instanceof Error) {
		result.error_schema = {
			error_code: 999,
			error_message: "Registrasi Gagal.",
		};
		result.output_schema = {};
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses." };
		result.output_schema = register_result;
		result.output_schema.is_freelancer = false;
		result.output_schema.is_connected_bank = false;
		result.output_schema.token = req.session.id;
	}

	res.send(result);
};

// pindah ke client controller
app.registerFreelancerFunction = async (req, res) => {
	const freelancer = req.body.freelancer;
	const username = req.body.username;

	const userInstance = new User();
	output_schema = await userInstance.registerAsFreelancer(freelancer, username);

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

	const clientInstance = new Client();
	const freelancerInstance = new Freelancer();
	let clientDetails = await clientInstance.getOtherClientProfile(userId);
	let isFreelancer = await freelancerInstance.isFreelancer(userId);

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
		const userInstance = new User();
		me = await userInstance.getMyProfile(req.session.client_id);
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
		const userInstance = new User();
		bank = await userInstance.getBankDetails(req.session.client_id);
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

	// console.log(req.session.id);
	// console.log(req.get("X-Token"));

	if (req.session.id == req.get("X-Token")) {
		let userId = req.session.client_id;
		let userInstance = new User();
		let images = [];

		images.push(await userInstance.addUserImage(req.files["profile_image"]));

		console.log(images);
		images = images.map((link) => link.replace(/"/g, ""));

		// parse JSON dari form-data biar jadi proper JSON dulu
		let data = JSON.parse(req.body.data);

		// abis ngebuat image
		// masuk ke usermodel buat edit data2nya
		let user_edit = await userInstance.editMyprofile(userId, data, images[0]);

		if (user_edit instanceof Error) {
			result.error_schema = { error_code: 999, error_message: "Gagal." };
			result.output_schema = {};
		} else {
			result.error_schema = { error_code: 200, error_message: "Success." };
			result.output_schema = {};
		}
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
			const userInstance = new User();
			let change = await userInstance.editBankDetails(
				req.session.client_id,
				req.body
			);
			result.error_schema = { error_code: 200, error_message: "Success." };
			result.output_schema = {};
		} catch {
			result.error_schema = { error_code: 999, error_message: "Gagal." };
			result.output_schema = {};
		}
		res.send(result);
	} else {
		result.error_schema = { error_code: 403, error_message: "Forbidden." };
		result.output_schema = {};
		res.send(result);
		return;
	}
};

module.exports = app;

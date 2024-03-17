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

	let login_info = await userInstance.login(username, password);

	result = {};

	if (
		login_info instanceof Error ||
		login_info == null ||
		login_info == undefined
	) {
		result.error_schema = { error_code: 903, error_message: "Login Gagal." };
		result.output_schema = {};
	} else {
		let x_token = req.session.id;
		// remove freelancer_id dari login_info
		result.error_schema = { error_code: 200, error_message: "Sukses." };
		result.output_schema = login_info;
		result.output_schema.token = x_token;

		let session_data = JSON.stringify({
			client_id: login_info.id,
			is_freelancer: login_info.is_freelancer,
			freelancer_id: login_info.freelancer_id,
			username: login_info.username,
		});

		console.log("X Token : " + x_token);
		console.log(session_data);

		let write_session_result = await userInstance.setUserSessionData(
			login_info.id,
			x_token,
			session_data
		);

		if (write_session_result instanceof Error) {
			result.error_schema = { error_code: 903, error_message: "Login Gagal." };
			result.output_schema = {};
		}

		delete login_info["freelancer_id"];
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
		x_token = req.session.id;
		result.error_schema = { error_code: 200, error_message: "Sukses." };
		result.output_schema = register_result;
		result.output_schema.is_freelancer = false;
		result.output_schema.is_connected_bank = false;
		result.output_schema.token = x_token;

		let session_data = JSON.stringify({
			client_id: register_result.id,
			is_freelancer: false,
			freelancer_id: null,
			username: username,
		});

		let write_session_result = await userInstance.setUserSessionData(
			login_info.id,
			x_token,
			session_data
		);

		if (write_session_result instanceof Error) {
			result.error_schema = {
				error_code: 903,
				error_message: "Registrasi Gagal.",
			};
			result.output_schema = {};
		}
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

	let x_token = req.get("X-Token");
	const userInstance = new User();
	let curr_session = await userInstance.getUserSessionData(x_token);

	if (curr_session.session_id == x_token) {
		console.log("Logout");
		req.session.destroy();

		let logout_result = await userInstance.logout(
			curr_session.session_data.client_id
		);

		if (logout_result instanceof Error) {
			result.error_schema = {
				error_code: 999,
				error_message: "Logout Failed.",
			};
			result.output_schema = {};
		}

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
		result.output_schema.is_freelancer = isFreelancer;
	}

	res.send(result);
};

app.getMyProfile = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	let me;
	let x_token = req.get("X-Token");
	const userInstance = new User();
	let curr_session = await userInstance.getUserSessionData(x_token);

	console.log("X-Token:");
	console.log(req.get("X-Token"));
	console.log("Session Data:");
	console.log(curr_session);
	console.log("==================");

	if (x_token == curr_session.session_id) {
		me = await userInstance.getMyProfile(curr_session.session_data.client_id);
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

	let x_token = req.get("X-Token");
	const userInstance = new User();
	let curr_session = await userInstance.getUserSessionData(x_token);

	console.log(curr_session);

	if (x_token == curr_session.session_id) {
		bank = await userInstance.getBankDetails(
			curr_session.session_data.client_id
		);
		if (bank == null) {
			result.error_schema = {
				error_code: 903,
				error_message: "Tidak ada data yang ditemukan.",
			};
			result.output_schema = null;
		} else {
			result.error_schema = { error_code: 200, error_message: "Sukses" };
			result.output_schema.bank_detail = bank;
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

	let x_token = req.get("X-Token");
	let userInstance = new User();
	let curr_session = await userInstance.getUserSessionData(x_token);

	if (curr_session.session_id == x_token) {
		let userId = curr_session.session_data.client_id;
		let images = [];
		if (req.files["profile_image"]) {
			images.push(await userInstance.addUserImage(req.files["profile_image"]));

			// console.log(images);
			images = images.map((link) => link.replace(/"/g, ""));
		}

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

	let x_token = req.get("X-Token");
	const userInstance = new User();
	let curr_session = await userInstance.getUserSessionData(x_token);
	console.log(curr_session);

	if (curr_session.session_id == x_token) {
		// console.log(req.body);
		try {
			let change = await userInstance.editBankDetails(
				curr_session.session_data.client_id,
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

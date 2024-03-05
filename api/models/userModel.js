const express = require("express");
const db = require("../../db");
const crypto = require("crypto");
const FormData = require("form-data");

module.exports = class User {
	// old login
	async getLoginInfo(username, password) {
		// Kalau sempet ini akan di rewrite
		// SP buat get client ID
		let clientID;
		if (username.includes("@")) {
			let SPGetClientID = `select client_id from public.client where email = '${username}' or username='${username}';`;
			let res = await db.any(SPGetClientID);
			clientID = res[0].client_id;
			console.log(clientID);
		}

		// SP buat cek dari DB
		let SP = `select username, name, profile_image as profile_image_url from public.client where client_id = '${clientID}' and password = '${password}';`;
		console.log(clientID);

		var result;
		try {
			result = await db.any(SP);
		} catch {
			result = null;
		}

		if (result == null || result[0] == undefined) return result[0];

		// SP buat cek status
		let SPStatus = `select count(*) as status from public.freelancer where user_id = '${clientID}';`;

		var status = await db.any(SPStatus);

		console.log(status);
		console.log(result);
		console.log(result[0]);

		if (status[0].status == "0") {
			result[0].is_freelancer = false;
		} else {
			result[0].is_freelancer = true;

			//get freelancer ID
			let SPFreelancerID = `select freelancer_id from freelancer where "user_id" = '${clientID}';`;
			let freelancer_id = await db.any(SPFreelancerID);
			result[0].freelancer_id = freelancer_id[0].freelancer_id;
		}

		// SP buat cek Bank Account
		let SPBank = `select count(*) from public.bank_information where user_id = '${clientID}';`;

		var bank = await db.any(SPBank);
		console.log(bank);

		if (bank[0].count == 0) {
			result[0].is_connected_bank = false;
		} else {
			result[0].is_connected_bank = true;
		}

		return result[0];
	}

	// ini dipake untuk login
	async login(username_email, password) {
		let SP = `
		select 
		(select 
		 case 
		 when count(*) = 1
		 then true
		 else false
		 end
		 as is_freelancer
		 from public.freelancer where user_id = 
		(select client_id from public.client where username = '${username_email}' or email = '${username_email}')),
		(select 
		 case 
		 when count(*) = 1 
		 then true 
		 else false
		 end 
		 as is_connected_bank
		 from public.bank_information where user_id = 
		(select client_id from public.client where username = '${username_email}' or email = '${username_email}')),
		profile_image as profile_image_url,
		username,
		name,
		client_id as id,
		(select freelancer_id from public.freelancer where user_id = 
		(select client_id from public.client where username = '${username_email}' or email = '${username_email}'))
		from 
		public.client
		where
		(username = '${username_email}'
		or
		email = '${username_email}')
		and 
		password = '${password}';`;

		try {
			let result = await db.any(SP);

			return result[0];
		} catch (error) {
			return new Error("Proses Login gagal");
		}
	}

	async registerAsClient(email, username, name, phone, password) {
		// Insert ke DB
		let SP = `insert into public.client (client_id, email, password, name, phone_number) values ('${username}', '${email}', '${password}', '${name}', '${phone}');`;
		console.log(SP);

		var result;
		try {
			result = await db.any(SP);
		} catch {
			result = null;
		}

		console.log(result);

		if (result == null) return result;

		// return JSON ke controller
		var result;
		result = {
			is_freelancer: false,
			is_connected_bank: false,
			profile_image_url: "",
			username: username,
			name: name,
			token: crypto.randomBytes(16).toString("hex"),
		};

		return result;
	}

	// ini dipake untuk register
	async register(email, username, name, phone, password) {
		// buat di SP insert data ke DB
		let SP_insert = `
		insert 
		into
		public.client
		(client_id, email, password, name, phone_number, profile_image, username)
		values
		(CONCAT('CL', (select nextval('client_id_sequence'))), '${email}', '${password}', '${name}', '${phone}', '', '${username}');
		`;

		// run SP insert
		try {
			let insert_result = await db.any(SP_insert);
		} catch (error) {
			return new Error("Gagal Insert.");
		}

		// buat SP get data buat di return

		let SP_return = `
			select 
			profile_image as profile_image_url,
			username,
			name,
			client_id as id
			from
			public.client
			where
			username = '${username}';
		`;
		try {
			let return_result = await db.any(SP_return);

			return return_result[0];
		} catch (error) {
			return new Error("Gagal Get.");
		}
	}

	async registerAsFreelancer(freelancer, username) {
		// cek dlu udah ada di client blm
		let checkerSP = `select count(*) from public.client where client_id ='${username}';`;

		var checkerResult;
		try {
			checkerResult = await db.any(checkerSP);
		} catch {
			checkerResult = null;
		}

		console.log(checkerResult);
		if (checkerResult == null || checkerResult[0].count != 1) return null;

		// check apakah dia pernah daftar engga sbg freelancer
		let checkerSP2 = `select count(*) from public.freelancer where user_id ='${username}';`;

		var checkerResult2;
		try {
			checkerResult2 = await db.any(checkerSP2);
		} catch {
			checkerResult2 = null;
		}

		console.log(checkerResult2);
		if (checkerResult2 == null || checkerResult2[0].count == 1) return null;

		// berarti sudah ada user tapi blm freelancer
		let insertSP = `insert into public.freelancer(freelancer_id, user_id) values ('${freelancer}', '${username}')`;

		var insertResult;
		try {
			insertResult = await db.any(insertSP);
		} catch {
			insertResult = null;
		}

		if (insertResult == null) return null;

		// return JSON ke controller

		return { freelancer: freelancer };
	}

	async getClientID(username) {
		let SPGetClientID = `select client_id from public.client where email = '${username}' or username='${username}';`;
		let res = await db.any(SPGetClientID);

		console.log(res[0].client_id + "RESCLEU");
		var client_id = res[0].client_id;

		return client_id;
	}

	async getMyProfile(clientId) {
		let SP = `select client_id as id, profile_image as profile_image_url, email, name, username, phone_number from public.client where client_id = '${clientId}';`;

		let result = await db.any(SP);

		return result[0];
	}

	async getBankDetails(clientId) {
		let SP = `
    select 
    bank_name,
    beneficiary_name,
    account_number 
    from 
    public.bank_information
    where
    user_id = '${clientId}';
    `;

		let result = await db.any(SP);

		return result[0];
	}

	async editMyprofile(clientId, data, image_url) {
		let SP = `
		update 
		public.client
		set 
		profile_image = '${image_url}',
		email = '${data.email}',
		name = '${data.name}',
		username = '${data.username}',
		phone_number = '${data.phone_number}'
		where client_id = '${clientId}'
		`;

		console.log(SP);

		try {
			let result = await db.any(SP);

			return result;
		} catch (error) {
			return new Error("Gagal Edit.");
		}
	}

	async editBankDetails(clientId, body) {
		let SP = `
    UPDATE
    public.bank_information
    set
    bank_name = '${body.bank_name}',
    beneficiary_name = '${body.beneficiary_name}',
    account_number = '${body.account_number}'
    where 
    user_id = '${clientId}';`;

		let res = await db.any(SP);

		// console.log('--RES--');
		// console.log(res);

		return res;
	}

	async addUserImage(image) {
		let link = "";
		const clientId = "33df5c9de1e057a";
		var axios = require("axios");
		var data = new FormData();

		data.append("image", image[0].buffer, { filename: `test.jpg` });

		var config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "https://api.imgur.com/3/image",
			headers: {
				Authorization: `Client-ID ${clientId}`,
				...data.getHeaders(),
			},
			data: data,
		};

		await axios(config)
			.then(function (response) {
				// console.log(JSON.stringify(response.data.data.link));
				link = JSON.stringify(response.data.data.link);
				return response.data.data.link;
			})
			.catch(function (error) {
				console.log(error);
			});

		return link;
	}
};

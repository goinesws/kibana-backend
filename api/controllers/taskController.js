const express = require("express");
const app = express();
const Task = require("../models/taskModel.js");

app.getNewTaskByCategory = async (req, res) => {
	console.log(req.params);

	var result = {};
	result.error_schema = {};
	result.output_schema = { tasks: "" };

	const taskInstance = new Task();
	let taskResult = await taskInstance.getNewTaskByCategory(
		req.params.categoryId
	);

	// console.log(taskResult);

	if (taskResult == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Tidak ada data yang ditemukan.",
		};
		result.output_schema.tasks = taskResult;
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema.tasks = taskResult;
	}

	res.send(result);
};

app.getTaskDetails = async (req, res) => {
	var result = {};

	result.error_schema = {};
	result.output_schema = {};

	const taskInstance = new Task();
	let taskDetailResult = await taskInstance.getTaskDetails(req.params.taskId);

	// console.log(taskDetailResult);

	if (taskDetailResult == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Tidak ada data yang ditemukan.",
		};
		result.output_schema = taskDetailResult;
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema = taskDetailResult;
	}

	res.send(result);
};

app.getTaskList = async (req, res) => {
	var result = {};

	result.error_schema = {};
	result.output_schema = {};

	const taskInstance = new Task();
	let taskListResult = await taskInstance.getTaskList(req.body);
	let total_amount = taskListResult.length;
	let has_next_page = true;

	if (req.body.last_id !== "" && req.body.last_id) {
		const indexOfTarget = taskListResult.findIndex(
			(obj) => obj.id === req.headers.last_id
		);
		if (indexOfTarget !== -1) {
			taskListResult = taskListResult.slice(
				indexOfTarget + 1,
				indexOfTarget + 9
			);
		} else {
			console.log("Object with specified id not found.");
		}
		if (total_amount - (indexOfTarget + 1) > 8) has_next_page = true;
		else has_next_page = false;
	} else {
		taskListResult = taskListResult.slice(0, 8);
		if (total_amount > 8) has_next_page = true;
		else has_next_page = false;
	}

	if (taskListResult == "" || taskListResult == null) {
		result.error_schema = {
			error_code: 903,
			error_message: "Tidak ada data yang ditemukan.",
		};
		result.output_schema.tasks = taskListResult;
	} else {
		result.error_schema = { error_code: 200, error_message: "Sukses" };
		result.output_schema.tasks = taskListResult;
		result.output_schema.total_amount = total_amount;
		result.output_schema.has_next_page = has_next_page;
		result.output_schema.last_id = taskListResult[taskListResult.length - 1].id;
	}

	res.send(result);
};

app.createTask = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	if (req.session.id == req.get("X-Token")) {
		// let taskInstance = new Task();
		// let create_task_result = taskInstance.createTask(req.body);

		let data = req.body;
		let userId = req.session.client_id;

		let taskInstance = new Task();
		let create_task_result = await taskInstance.createTask(data, userId);

		console.log(create_task_result);

		if (create_task_result instanceof Error) {
			result.error_schema = {
				error_code: 999,
				error_message: "Gagal membuat tugas baru.",
			};
			result.output_schema = {};
		} else {
			result.error_schema = {
				error_code: 200,
				error_message: "Sukses.",
			};
			result.output_schema = {};
		}
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki hak untuk melakukan hal tersebut.",
		};
		result.output_schema = {};
	}
	res.send(result);
};

app.getOwnedTask = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	if (req.session.id == req.get("X-Token")) {
		let taskInstance = new Task();

		let task_result = await taskInstance.getOwnedTask(req.session.client_id);

		if (task_result instanceof Error) {
			result.error_schema = {
				error_code: 999,
				error_message: "Gagal Mendapatkan Data.",
			};
			result.output_schema = {};
		} else {
			result.error_schema = {
				error_code: 200,
				error_message: "Sukses.",
			};
			result.output_schema.tasks = task_result;
		}
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki hak untuk melakukan hal tersebut.",
		};
		result.output_schema = {};
	}
	res.send(result);
};

app.getOwnedTaskDetails = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	if (req.session.id == req.get("X-Token")) {
		let taskId = req.params.taskId;
		let userId = req.session.client_id;

		let taskInstance = new Task();
		let task_result = await taskInstance.getOwnedTaskDetails(taskId, userId);

		if (task_result instanceof Error) {
			result.error_schema = {
				error_code: 999,
				error_message: "Gagal Mengambil Data.",
			};
			result.output_schema = {};
		} else {
			result.error_schema = {
				error_code: 200,
				error_message: "Sukses.",
			};
			result.output_schema.task_detail = task_result;
		}
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki hak untuk melakukan hal tersebut.",
		};
		result.output_schema = {};
	}
	res.send(result);
};

app.getRegisteredFreelancer = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	if (req.session.id == req.get("X-Token")) {
		let taskId = req.params.taskId;
		let userId = req.session.client_id;

		let taskInstance = new Task();
		let task_result = await taskInstance.getRegisteredFreelancer(
			taskId,
			userId
		);

		if (task_result instanceof Error) {
			result.error_schema = {
				error_code: 999,
				error_message: "Gagal Mendapatkan Data.",
			};
			result.output_schema = {};
		} else {
			result.error_schema = {
				error_code: 200,
				error_message: "Sukses.",
			};
			result.output_schema = task_result;
		}
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki hak untuk melakukan hal tersebut.",
		};
		result.output_schema = {};
	}
	res.send(result);
};

app.deleteTask = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	if (req.session.id == req.get("X-Token")) {
		let taskId = req.params.taskId;
		let userId = req.session.client_id;

		let taskInstance = new Task();
		let task_result = taskInstance.deleteTask(taskId, userId);

		if (task_result instanceof Error) {
			result.error_schema = {
				error_code: 999,
				error_message: "Gagal Menghapus Data.",
			};
			result.output_schema = {};
		} else {
			result.error_schema = {
				error_code: 200,
				error_message: "Sukses.",
			};
			result.output_schema = {};
		}
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki hak untuk melakukan hal tersebut.",
		};
		result.output_schema = {};
	}

	res.send(result);
};

app.getTaskHistory = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	if (req.session.id == req.get("X-Token") && req.session.is_freelancer) {
		let userId = req.session.freelancer_id;
		console.log(userId);

		let taskInstance = new Task();
		let task_result = await taskInstance.getTaskHistory(userId);

		if (task_result instanceof Error) {
			result.error_schema = {
				error_code: 903,
				error_message: "Gagal mendapatkan data.",
			};
			result.output_schema = {};
		} else {
			result.error_schema = {
				error_code: 200,
				error_message: "Sukses.",
			};
			result.output_schema = task_result;
		}
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki hak untuk melakukan hal tersebut.",
		};
		result.output_schema = {};
	}

	res.send(result);
};

app.getTaskHistoryDetails = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	if (req.session.id == req.get("X-Token") && req.session.is_freelancer) {
		let taskId = req.params.taskId;
		let userId = req.session.freelancer_id;

		let taskInstance = new Task();
		let task_result = await taskInstance.getTaskHistoryDetails(taskId, userId);

		if (task_result instanceof Error) {
			result.error_schema = {
				error_code: 999,
				error_message: "Terjadi Kegagalan.",
			};
			result.output_schema = {};
		} else {
			result.error_schema = {
				error_code: 403,
				error_message: "Anda tidak memiliki hak untuk melakukan hal tersebut.",
			};
			result.output_schema.task_detail = task_result;
		}
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki hak untuk melakukan hal tersebut.",
		};
		result.output_schema = {};
	}

	res.send(result);
};

app.chooseFreelancer = async (req, res) => {
	let result = {};

	result.error_schema = {};
	result.output_schema = {};

	if (req.session.id == req.get("X-Token")) {
	} else {
		result.error_schema = {
			error_code: 403,
			error_message: "Anda tidak memiliki hak untuk melakukan hal tersebut.",
		};
		result.output_schema = {};
	}

	res.send(result);
};

module.exports = app;

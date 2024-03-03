const express = require("express");
const db = require("../../db");
const Review = require("../models/reviewModel");
const Task = require("../models/taskModel");

module.exports = class Transaction {
    async getAllTransactionDetail(transaction_id) {
		// SP buat get Client Details
		let SP = `SELECT 
                transaction_id,
                project_id,
                client_id,
                status,
                TO_CHAR(deadline, 'DD Mon YYYY') as deadline,
                TO_CHAR(delivery_date, 'DD Mon YYYY') as delivery_date,
                remaining_revision,
                is_need_admin,
                can_cancel,
                can_return,
                TO_CHAR(payment_date, 'DD Mon YYYY') as payment_date,
                freelancer_id,
                project_type
            FROM
                transaction
            WHERE
                transaction_id = '${transaction_id}'`
        ;

		let result = await db.any(SP);

		return result[0];
	}

	async getTransactionInvoice(taskId) {
		// SP buat get Client Details
		let SPGetClient = `select public.client.client_id as id, profile_image as profile_image_url, public.client.name from public.client 
    join 
    public.task 
    on
    public.client.client_id = public.task.client_id
    and
    public.task.task_id = '${taskId}';`;

		let result = await db.any(SPGetClient);

		return result;
	}

    async getTransactionClient(transaction_id) {
		// SP buat get Client Details
		let SP = `SELECT 
                *
            FROM
                transaction
            JOIN 
                client
            ON 
                client.client_id = transaction.client_id
            WHERE
                transaction_id = '${transaction_id}'`
        ;

		let result = await db.any(SP);

		return result[0];
	}

    async getTransactionFreelancer(transaction_id) {
		// SP buat get Client Details
		let SP = `SELECT 
                *
            FROM
                transaction
            JOIN 
                freelancer
            ON 
                freelancer.freelancer_id = transaction.freelancer_id
            JOIN
                client
            ON
                freelancer.user_id = client.client_id
            WHERE
                transaction_id = '${transaction_id}'`
        ;

		let result = await db.any(SP);

		return result[0];
	}
    
    

};

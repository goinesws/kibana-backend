const express = require('express');
const app = express();
const Transaction = require('../models/transactionModel.js');
const Service = require('../models/serviceModel.js');
const Task = require('../models/taskModel.js');
const errorMessages = require('../messages/errorMessages');

app.getTransactionInvoice = async (req, res) =>  {
    let result = {};

    if (req.get('X-Token') == req.session.id) {
        const transaction_id = req.params.transactionId;

        result.error_schema = {};
        result.output_schema = {};
        result.output_schema.project = {};
        result.output_schema.fee = {};

        // console.log(JSON.stringify(result))
        var transactionInstance = new Transaction();
        var serviceInstance = new Service();
        var taskInstance = new Task();
        var transactionClient = await transactionInstance.getTransactionClient(transaction_id);
        var transactionFreelancer = await transactionInstance.getTransactionFreelancer(transaction_id);

        console.log(transactionClient.username)
        console.log(transactionFreelancer.username)
        console.log(req.session.username)


        if (transactionClient.username == req.session.username || transactionFreelancer.username == req.session.username) {
            
            var projectResult;
            var transactionDetail = await transactionInstance.getAllTransactionDetail(transaction_id);
            // console.log(JSON.stringify(transactionDetail) + "transactionDetail")
            var additional_data = '';
            var project_type = await transactionDetail.project_type;

            if(project_type == 'Service') {
                projectResult = await serviceInstance.getAllServiceDetail(transactionDetail.project_id);
                // console.log(JSON.stringify(projectResult) + "PROJECT RESULT")
                additional_data = await serviceInstance.getAdditionalData(transactionDetail.project_id);
                result.output_schema.project.duration = projectResult.working_time;
                result.output_schema.project.revision_count = projectResult.revision_count;
                result.output_schema.project.additional_data = additional_data;
            } else {
                projectResult = await taskInstance.getAllTaskDetail(transactionDetail.project_id)
            }

            var fee = projectResult.price * 0.01;
            console.log(JSON.stringify(projectResult) + "PROJECT RESULT")

            if (projectResult == null) {
                result.error_schema = {'error_code': 903, 'error_message': errorMessages.DATA_NOT_FOUND};
                result.output_schema.transactions = serviceResult;
            } else {
                result.error_schema = {'error_code': 200, 'error_message': errorMessages.QUERY_SUCCESSFUL};
                result.output_schema.ref_no = transaction_id;
                result.output_schema.client_name = transactionClient.name;
                result.output_schema.freelancer_name = transactionFreelancer.name;
                result.output_schema.payment_date = transactionDetail.payment_date;
                result.output_schema.project.name = projectResult.name;
                result.output_schema.project.price = projectResult.price;
                result.output_schema.fee.amount = fee;
                result.output_schema.fee.percentage = 1;
                result.output_schema.total_price = parseFloat(projectResult.price) + parseFloat(fee);
                result.output_schema.project.additional_data = additional_data;
            }
        } else {
            result.error_schema = {'error_code': 403, 'error_message': errorMessages.NOT_PROJECT_OWNER};
            result.output_schema = null;
        }
    } else {
        result.error_schema = {'error_code': 403, 'error_message': errorMessages.NOT_LOGGED_IN};
        result.output_schema = null;
    }
    res.send(result);
  }


module.exports = app;
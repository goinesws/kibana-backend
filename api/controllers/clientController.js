const express = require('express');
const app = express();
const Client = require('../models/clientModel.js');
const Freelancer = require('../models/freelancerModel.js');

app.getOtherProfile = async (req,res) => {
  let result = {};
  let userId = req.params.userId;

  result.error_schema = {};
  result.output_schema = {};

  let clientDetails = await Client.getOtherClientProfile(userId);
  let isFreelancer = await Freelancer.isFreelancer(userId);

  if (clientDetails == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema = null;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema = clientDetails;
    result.output_schema.isFreelancer = isFreelancer;  
  }


  res.send(result);
}

module.exports = app;

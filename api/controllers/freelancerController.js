const express = require('express');
const app = express();
const Freelancer = require('../models/freelancerModel.js');

app.getFreelancerDescription = async (req,res) => {
  let result = {};
  let userId = req.params.userId;

  result.error_schema = {};
  result.output_schema = {};

  let desc = await Freelancer.getDesc(userId);

  if (desc == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema = null;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema = desc;
  }

  res.send(result);
}

app.getFreelancerEducationHistory = async (req,res) => {
  let result = {};

  result.error_schema = {};
  result.output_schema = {};

  return result;
}

app.getFreelancerSkill = async (req,res) => {
  let result = {};

  result.error_schema = {};
  result.output_schema = {};

  return result;
}

app.getFreelancerVC = async (req,res) => {
  let result = {};

  result.error_schema = {};
  result.output_schema = {};

  return result;
}


app.getPortofolio = async (req,res) => {
  let result = {};

  result.error_schema = {};
  result.output_schema = {};

  return result;
}


app.getOwnedTask = async (req,res) => {
  let result = {};

  result.error_schema = {};
  result.output_schema = {};

  return result;
}

module.exports = app;
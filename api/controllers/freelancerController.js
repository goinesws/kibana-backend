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
  let userId = req.params.userId;

  result.error_schema = {};
  result.output_schema = {};

  let edu = await Freelancer.getEducationHistory(userId);

  console.log(edu);

  if (edu == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.education_history = null;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.education_history = edu;
  }

  return res.send(result);
}

app.getFreelancerSkill = async (req,res) => {
  let result = {};
  let userId = req.params.userId;

  result.error_schema = {};
  result.output_schema = {};

  let skills = await Freelancer.getSkill(userId);
  
  if (skills == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema.skills = null;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema.skills = skills;
  }

  res.send(result);
}

app.getFreelancerCV = async (req,res) => {
  let result = {};
  let userId = req.params.userId;

  result.error_schema = {};
  result.output_schema = {};

  let CV = await Freelancer.getCV(userId);

  if (CV == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema = null;
  } else {  
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema = CV;
  }

  res.send(result);
}


app.getPortfolio = async (req,res) => {
  let result = {};
  let userId = req.params.userId;

  result.error_schema = {};
  result.output_schema = {};

  let portfolio = await Freelancer.getPortfolio(userId);

  if (portfolio == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema = null;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema = portfolio;
  }

  res.send(result);
}

app.getOwnedService = async (req,res) => {
  let result = {};
  let userId = req.params.userId;

  result.error_schema = {};
  result.output_schema = {};

  let owned_service = await Freelancer.getOwnedService(userId);

  if (result == null) {
    result.error_schema = {'error_code': 903, 'error_message': 'Tidak ada data yang ditemukan.'};
    result.output_schema = null;
  } else {
    result.error_schema = {'error_code': 200, 'error_message': 'Sukses'};
    result.output_schema = owned_service;
  }

  res.send(result);
}

module.exports = app;
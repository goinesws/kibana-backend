const express = require('express');
const app = express();
const user = require('../models/userModel')

app.loginFunction = async (req, res) => {
  const username = req.body.username_email;
  const password = req.body.password;

  output_schema = await user.getLoginInfo(username,password);

  let failed = false;
  if (output_schema == null || output_schema == undefined) failed = true;

  result = {};

  if (failed) {
    result.error_schema = {error_code: 999, error_message: "Login Gagal."};
    result.output_schema = {};
  } else { 
    result.error_schema = {error_code: 200, error_message: "Sukses."};
    result.output_schema = output_schema;
  }

  res.send(result);
}

app.registerFunction = async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const name = req.body.name;
  const phone = req.body.phone_number;
  const password = req.body.password;

  output_schema = await user.registerAsClient(email, username, name, phone, password);

  result = {};

  if (output_schema == null) {
    result.error_schema =  {error_code: 999, error_message: "Registrasi Gagal."};
    result.output_schema = {};
  } else {
    result.error_schema =  {error_code: 200, error_message: "Sukses."};
    result.output_schema = output_schema;
  }

  res.send(result);
}

app.registerFreelancerFunction = async (req, res) => {
  const freelancer = req.body.freelancer;
  const username = req.body.username;

  output_schema = await user.registerAsFreelancer(freelancer, username);

  result = {};

  if (output_schema == null) {
    result.error_schema =  {error_code: 999, error_message: "Registration Failed."};
    result.output_schema = {};
  } else {
    result.error_schema =  {error_code: 200, error_message: "Success"};
    result.output_schema = output_schema;
  }

  res.send(result);
}


module.exports = app;
const express = require('express');
const db = require('../../db');

// SP check password
async function getLoginInfo (username, password) {
  let SP = `select client_id as username, name, profile_image as profile_image_url from public.client where client_id = '${username}' and password = '${password}';`;
  console.log(SP);
  var result;

  try { 
    result = await db.any(SP);
  } catch {
    result = null;
  }

  if (result == null || result[0] == undefined) return result[0];

  let SPStatus = `select count(*) + 1 as status from public.freelancer where "user_id" = '${username}';`

  var status = await db.any(SPStatus);

  console.log(result);
  console.log(result[0]);

  result[0].status = status[0].status;

  return result[0];
}

async function registerAsClient (email, username, name, phone, password) {
  let SP = ''
}

async function registerAsFreelancer () {

}

module.exports = { getLoginInfo };
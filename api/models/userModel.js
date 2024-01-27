const express = require('express');
const db = require('../../db');
const crypto = require('crypto');

async function getLoginInfo (username, password) {
  // SP buat get client ID
  let clientID = username;
  if (username.includes('@')) {
    let SPGetClientID = `select client_id from public.client where email = '${username}';`;
    let res = await db.any(SPGetClientID);
    clientID = res[0].client_id;
    console.log(clientID);
  }

  // SP buat cek dari DB
  let SP = `select client_id as username, name, profile_image as profile_image_url from public.client where client_id = '${clientID}' and password = '${password}';`;
  console.log(SP);

  var result;
  try { 
    result = await db.any(SP);
  } catch {
    result = null;
  }

  if (result == null || result[0] == undefined) return result[0];

  // SP buat cek status
  let SPStatus = `select count(*) as status from public.freelancer where "user_id" = '${clientID}';`

  var status = await db.any(SPStatus);

  console.log(result);
  console.log(result[0]);

  if (status == 0) {
    result[0].is_freelancer = false;
  } else {
    result[0].is_freelancer = true;
  }

  // SP buat cek Bank Account
  let SPBank = `select count(*) from public.bank_information where user_id = '${clientID}';`;

  var bank = await db.any(SPBank);

  if (bank == 0) {
    result[0].is_connected_bank = false;
  } else {
    result[0].is_connected_bank = true;
  }

  result[0].token = crypto.randomBytes(16).toString('hex');

  return result[0];
}

async function registerAsClient (email, username, name, phone, password) {
  let SP = `insert into public.client (client_id, email, password, name, phone_number) values ('${username}', '${email}', '${password}', '${name}', '${phone}');`
  console.log(SP);

  var result;
  try {
    result = await db.any(SP);
  } catch {
    result = null;
  }

  console.log(result);

  if (result == null) return result;

  var result;

  result = {'is_freelancer': false, 'is_connected_bank': false, 'profile_image_url': '', 'username': username, 'name': name, 'token': crypto.randomBytes(16).toString('hex')};

  return result; 
}

async function registerAsFreelancer (freelancer, username) {
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

  return {freelancer: freelancer};
}

module.exports = { getLoginInfo, registerAsClient, registerAsFreelancer };
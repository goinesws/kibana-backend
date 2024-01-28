const express = require('express');
const db = require('../../db');

async function getNewTask (categoryId) {
  let SP = `select task_id as id, name, description, tags, deadline as due_date, difficulty, price from public.task where sub_category_id = '${categoryId}';`;

  var result = await db.any(SP);

  console.log(result);

  return result;
}

module.exports = { getNewTask };
const express = require("express");
const db = require("../../db");
const { search } = require("../controllers/userController");

module.exports = class Task {
  static getTaskList(req, res) {
    const searchText = req.body.search_text;
    const subcategory = req.body.sub_category;
    const budget = req.body.budget;
    const budgetStart = req.body.budget.budget_start;
    const budgetEnd = req.body.budget.budget_end;
    const difficulty = req.body.difficulty;
    const lastId = req.body.last_id;
    let SP = `
      SELECT * FROM public.task
      WHERE (name || description ILIKE '%${searchText}%'
      OR '${searchText}' ILIKE ANY (tags))
    `;
    if (subcategory !== null) {
      SP += `AND sub_category_id WHERE '${subcategories}'`;
    }
    if (budget !== null) {
      if (budgetEnd !== null) {
        SP += `AND price BETWEEN '${budgetStart}' AND '${budgetEnd}'`;
      } else {
        SP += `AND price > '${budgetStart}'`;
      }
    }
    if (difficulty !== null) {
      SP += `AND difficulty = '${difficulty}'`;
    }

    result = await db.any(SPGetCategories);
  }
}

 

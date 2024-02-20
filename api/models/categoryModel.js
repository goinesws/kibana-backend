const express = require("express");
const db = require("../../db");

module.exports = class Category {
  static async getAllCategoriesForTask () {
    let SPGetCategories = `select category_id as id, name, image from public.category`;

    let result = await db.any(SPGetCategories);

    return result;
  }
}
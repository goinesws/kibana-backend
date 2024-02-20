const express = require("express");
const db = require("../../db");
const { search } = require("../controllers/userController");

class CategoryModel {
    constructor(service_id, subcategory_id, freelancer_id, name, description) {
        this.service_id = service_id;
        this.subcategory_id = subcategory_id;
        this.freelancer_id = freelancer_id;
        this.name = name;
        this.description = description;
    }
}
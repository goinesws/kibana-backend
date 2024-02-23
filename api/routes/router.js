const express = require('express');
const router  = express.Router(); 
const db = require('../../db');
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');
const serviceController = require('../controllers/serviceController');
const subcategoryController = require('../controllers/subcategoryController');
const categoryController = require('../controllers/categoryController');
const clientController = require('../controllers/clientController');
const freelancerController = require('../controllers/freelancerController');
const Subcategory = require('../models/subcategoryModel');

router.get('/', async (req, res) => {
  try {
      const result = await db.any('select * from public.client');
      res.json(result);
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User & Auth Related
router.post('/login', userController.loginFunction);
router.post('/register', userController.registerFunction);
router.post('/register-freelancer', userController.registerFreelancerFunction);

// Task Related
router.get('/api/task/new/:categoryId', taskController.getNewTaskByCategory);
router.get('/api/task/category/:categoryId/detail', taskController.getTaskCategoryDetail);
router.get('/api/task/category', taskController.getTaskCategories);
router.post('/api/task/list', taskController.getTaskList);
router.get('/api/task/detail/:taskId', taskController.getTaskDetails);

// Service Related
router.get('/api/service/new/:categoryId', serviceController.getNewService);
router.get('/api/service/new', serviceController.getNewService);
router.get('/api/service/list', serviceController.getServiceList);
router.get('/api/service/detail/:serviceId', serviceController.getServiceDetail);


router.get('/api/service/category/:categoryId/detail', subcategoryController.getSubcategoryByCategory);

router.get('/api/service/category', categoryController.getAllCategorySubcategory);



// Account Related
router.get('/api/account/profile/:userId', clientController.getOtherProfile);
router.get('/api/account/description/:userId', freelancerController.getFreelancerDescription);
router.get('/api/account/educations/:userId', freelancerController.getFreelancerEducationHistory);
router.get('/api/account/skills/:userId', freelancerController.getFreelancerSkill);
router.get('/api/account/cv/:userId', freelancerController.getFreelancerCV);
router.get('/api/account/portfolio/:userId', freelancerController.getPortfolio);
router.get('/api/account/services/:userId', freelancerController.getOwnedService);

module.exports = router;

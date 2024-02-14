const express = require('express');
const router  = express.Router(); 
const db = require('../../db');
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');

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
router.get('/api/task/category/:categoryId/details', taskController.getTaskCategoryDetails);
router.get('/api/task/category', taskController.getTaskCategories);
router.post('api/task/list', taskController.getTaskList);

module.exports = router;
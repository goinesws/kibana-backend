const express = require('express');
const router  = express.Router(); 
const db = require('../../db');
const userController = require('../controllers/userController');

router.get('/', async (req, res) => {
  try {
      const result = await db.any('select * from public.client');
      res.json(result);
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User Related
router.post('/login', userController.loginFunction);
router.post('/register', userController.registerFunction);
router.post('/register-freelancer', userController.registerFreelancerFunction);


module.exports = router;
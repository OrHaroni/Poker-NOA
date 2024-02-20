const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users.js');

//Get all users
router.route('/users').get(userControllers.getAllUsers);



module.exports = router;
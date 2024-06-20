const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users.js');

//Get all users
router.route('/').get(userControllers.getAllUsers);

//Validate a user that wants to connect
router.route('/validateUser').post(userControllers.validateUser);

//try to register a user
router.route('/register').post(userControllers.addUser);

//Add money
router.route('/addMoney').post(userControllers.addMoney);

//Get the user's Statistics
router.route('/getStat/:username').get(userControllers.getStat);



module.exports = router;
const express = require('express');
const router = express.Router();
const tableControllers = require('../controllers/tables.js');

//Get all tables
router.route('/').get(tableControllers.getAllTables);

//Validate a table that a user wants to go into
router.route('/validateTable').post(tableControllers.validateTable);

//try to register a user
router.route('/addTable').post(tableControllers.addTable);


module.exports = router;
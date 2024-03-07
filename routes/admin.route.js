const express = require('express');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

//ROUTES

// GET
router.get('/get-all-managers-attendance/:year/:month', adminController.getAllManagerAttendance);
router.get('/get-all-managers', adminController.getAllManagers);


module.exports = router;
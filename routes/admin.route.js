const express = require('express');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

//ROUTES
router.get('/get-all-managers-attendance', adminController.getAllManagerAttendance);


module.exports = router;
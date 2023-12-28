const express = require('express');
const router = express.Router();

const attendenceController = require('../controllers/attendance.controller');

//ROUTES
router.post('/insert-attendence', attendenceController.insertAttendance);


module.exports = router;
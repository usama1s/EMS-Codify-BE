const express = require('express');
const router = express.Router();

const attendenceController = require('../controllers/attendance.controller');

//ROUTES

// POST
router.post('/insert-attendence', attendenceController.insertAttendance);
router.post('/clock-out', attendenceController.clockOut);

// GET
router.get('/get-clock-in-time/:user_id', attendenceController.getClockInTime);


module.exports = router;
const express = require('express');
const router = express.Router();

const attendenceController = require('../controllers/attendance.controller');

//ROUTES
router.post('/insert-attendence', attendenceController.insertAttendance);

router.post('/clock-out', attendenceController.clockOut);

router.get('/get-clock-in-time/:user_id', attendenceController.getClockInTime);


module.exports = router;
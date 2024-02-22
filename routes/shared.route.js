const express = require('express');
const sharedController = require('../controllers/shared.controller');

const router = express.Router();

//ROUTES
router.get('/get-attendance', sharedController.getAttendanceByUserId);
router.get('/get-clockin-status/:userId/:date', sharedController.getClockStatusByUserIdAndDate);
router.get('/get-clockin-time/:userId/:date', sharedController.getClockInTimeByUserIdAndDate);
router.post('/add-daily-progress', sharedController.addDailyProgress);
router.get('/check-progress', sharedController.checkProgress);
router.get('/get-progress-detail/:attendanceId/:date', sharedController.getProgressDetail);

module.exports = router;
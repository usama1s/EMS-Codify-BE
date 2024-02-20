const express = require('express');
const sharedController = require('../controllers/shared.controller');

const router = express.Router();

//ROUTES
router.get('/get-attendance/:userId', sharedController.getAttendanceByUserId);
router.get('/get-clockin-status/:userId/:date', sharedController.getClockStatusByUserIdAndDate);
router.get('/get-clockin-time/:userId/:date', sharedController.getClockInTimeByUserIdAndDate);
router.post('/add-daily-progress', sharedController.addDailyProgress);
router.post('/check-progress', sharedController.checkProgress);

router.get('/get-progress-detail/:attendanceId/:date', sharedController.getProgressDetail);
// router.post('/fetch-data-by-month-year', sharedController.checkProgress);

module.exports = router;
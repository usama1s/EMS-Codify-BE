const express = require('express');
const sharedController = require('../controllers/shared.controller');

const router = express.Router();

//ROUTES
router.get('/get-attendance/:userId', sharedController.getAttendanceByUserId);
router.get('/get-clockin-status/:userId/:date', sharedController.getClockStatusByUserIdAndDate);
router.get('/get-clockin-time/:userId/:date', sharedController.getClockInTimeByUserIdAndDate);
router.post('/add-daily-progress', sharedController.addDailyProgress);
router.get('/check-progress/:userId/:date/:startTime', sharedController.checkProgress);

module.exports = router;
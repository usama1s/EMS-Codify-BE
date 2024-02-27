const express = require('express');
const sharedController = require('../controllers/shared.controller');

const router = express.Router();

//ROUTES
router.get('/get-attendance', sharedController.getAttendanceByUserId);
router.get('/get-clockin-status/:userId/:date', sharedController.getClockStatusByUserIdAndDate);
router.get('/get-clockin-time/:userId/:date', sharedController.getClockInTimeByUserIdAndDate);
router.post('/add-daily-progress', sharedController.addDailyProgress);
router.get('/check-progress', sharedController.checkProgress);
router.get('/check-all-progress-entered', sharedController.checkAllProgressEntered);
router.get('/get-progress-detail/:attendanceId/:date', sharedController.getProgressDetail);
router.post('/apply-for-leave', sharedController.applyLeave);
router.get('/get-all-pending-leaves', sharedController.getAllPendingleaves);
router.put('/update-leave-status', sharedController.updateLeaveStatus);

module.exports = router;
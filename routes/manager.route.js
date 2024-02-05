const express = require('express');
const managerController = require('../controllers/manager.controller');

const router = express.Router();

//ROUTES
router.get('/get-manager-attendance/:userId', managerController.getManagerAttendanceByUserId);

module.exports = router;
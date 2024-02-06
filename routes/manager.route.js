const express = require('express');
const managerController = require('../controllers/manager.controller');

const router = express.Router();

//ROUTES
router.get('/get-attendance/:userId', managerController.getAttendanceByUserId);
router.post('/register-employee', managerController.registerEmployee);
router.get('/get-all-employees', managerController.getAllEmployee);
router.get('/get-all-employees-attendance', managerController.getAllEmployeesAttendance);

module.exports = router;
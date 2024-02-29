const express = require('express');
const managerController = require('../controllers/manager.controller');

const router = express.Router();

//ROUTES
router.post('/register-employee', managerController.registerEmployee);
router.post('/add-asset-data', managerController.addAsset);
router.get('/get-all-employees', managerController.getAllEmployee);
router.get('/get-all-employees-attendance/:year/:month', managerController.getAllEmployeesAttendance);

module.exports = router;
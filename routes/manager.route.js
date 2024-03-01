const express = require('express');
const managerController = require('../controllers/manager.controller');

const router = express.Router();

//ROUTES
router.post('/register-employee', managerController.registerEmployee);
router.post('/add-asset-data', managerController.addAsset);
router.get('/get-all-users', managerController.getUsers);
router.get('/get-all-employees', managerController.getAllEmployee);
router.get('/get-all-employees-attendance/:year/:month', managerController.getAllEmployeesAttendance);
router.get('/get-all-assets', managerController.getAllAsset);

module.exports = router;
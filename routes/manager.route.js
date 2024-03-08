const express = require('express');
const managerController = require('../controllers/manager.controller');

const router = express.Router();

//ROUTES

// POST
router.post('/register-employee', managerController.registerEmployee);
router.post('/add-asset-data', managerController.addAsset);
router.post('/allot-asset', managerController.allotAsset);
router.post('/create-employee-contract', managerController.createContact);
router.post('/pay-salary', managerController.paySalary);

// GET
router.get('/get-all-users', managerController.getUsers);
router.get('/get-all-employees', managerController.getAllEmployee);
router.get('/get-all-employees-without-active-contract', managerController.getAllEmployeeWithoutActiveContract);
router.get('/get-all-contract-by-userid', managerController.getAllUserContracts);
router.get('/get-all-employees-attendance/:year/:month', managerController.getAllEmployeesAttendance);
router.get('/get-all-assets', managerController.getAllAsset);
router.get('/get-all-assets-not-alloted', managerController.getAllAssetNotAlloted);
router.get('/get-all-alloted-assets', managerController.getAllAllottedAsset);
router.get('/get-all-managers', managerController.getAllManagers);
router.get('/get-all-active-contracts', managerController.getAllActiveContractsWithPay);

//PUT
router.put('/change-contract-status', managerController.changeContactStatus);


module.exports = router;
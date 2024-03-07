const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

//ROUTES

//POST
router.post('/register-user', authController.registerUser);
router.post('/sign-in', authController.signIn);


module.exports = router;
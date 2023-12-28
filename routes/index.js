const express = require('express');
const router = express.Router();

// ALL ROUTES THAT ARE REQUIRED
const authRoute = require('./auth.route');
const attendenceRoute = require('./attendance.route');
const managerRoute = require('./attendance.route');



// ROUTES
router.use('/auth', authRoute);
router.use('/attendence', attendenceRoute);
router.use('/manager', managerRoute);



module.exports = router;
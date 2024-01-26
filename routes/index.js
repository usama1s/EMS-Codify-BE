const express = require('express');
const router = express.Router();

// ALL ROUTES THAT ARE REQUIRED
const authRoute = require('./auth.route');
const attendenceRoute = require('./attendance.route');
const managerRoute = require('./attendance.route');
const adminRoute = require('./admin.route');



// ROUTES
router.use('/auth', authRoute);
router.use('/attendence', attendenceRoute);
router.use('/manager', managerRoute);
router.use('/admin', adminRoute);



module.exports = router;
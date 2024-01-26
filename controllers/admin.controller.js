const adminService = require("../services/admin.service");
const convertBase64 = require('../utils/convert.base64');


module.exports = {

    // GET ALL MANAGERS ATTENDANCE
    async getAllManagerAttendance(req, res) {
        try {
            const attendance = await adminService.getAllManagerAttendance();
            return res.status(200).json(attendance);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed add attencdence" });
        }
    },

}
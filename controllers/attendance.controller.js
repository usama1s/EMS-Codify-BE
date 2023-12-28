const attendanceService = require("../services/attendance.service");
const convertBase64 = require('../utils/convert.base64');


module.exports = {

    // INSERT ATTENDENCE
    async insertAttendance(req, res) {
        try {
            const attendenceDetail = req.body;
            const attendanceFilePath = await convertBase64.base64ToJpg(attendenceDetail.attendance_picture);
            const attendanceAdded = await attendanceService.insertAttendance(attendenceDetail, attendanceFilePath);
            return res.status(200).json({ message: attendanceAdded.message });
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed add attencdence" });
        }
    },

}
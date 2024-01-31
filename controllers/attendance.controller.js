const attendanceService = require("../services/attendance.service");
const utils = require('../utils/utils');


module.exports = {

    // INSERT ATTENDENCE
    async insertAttendance(req, res) {
        try {
            const attendenceDetail = req.body;
            const attendanceAdded = await attendanceService.insertAttendance(attendenceDetail);
            return res.status(200).json({ message: attendanceAdded.message });
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed add attencdence" });
        }
    },

    // CLOCK OUT
    async clockOut(req, res) {
        try {
            const attendenceDetail = req.body;
            const attendanceAdded = await attendanceService.clockOut(attendenceDetail);
            return res.status(200).json({ message: attendanceAdded.message });
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed add attencdence" });
        }
    },

    // GET AT WHAT TIME THE USER CLOCKED-IN
    async getClockInTime(req, res) {
        try {
            const { user_id, clock_type } = req.query; // Use req.query to get query parameters
            const recent_attendance_time = await attendanceService.getClockInTime(user_id, clock_type);
            return res.status(200).json({ recent_attendance_time });
        } catch (error) {
            console.error("Error getting clock-in time:", error);
            return res.status(401).json({ error: "Failed to get attendance time" });
        }
    }


}
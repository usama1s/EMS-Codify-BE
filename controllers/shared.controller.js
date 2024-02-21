
const sharedService = require("../services/shared.service");


module.exports = {

    // GET ATTENDANCE BY USER ID
    async getAttendanceByUserId(req, res) {
        try {
            const { userId, year, month } = req.query;
            const Attendance = await sharedService.getAttendanceByUserId(userId, year, month);
            return res.status(200).json(Attendance);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed add attencdence" });
        }
    },

    // GET CLOCK IN STATUS BY USER-ID AND DATE
    async getClockStatusByUserIdAndDate(req, res) {
        try {
            const { userId, date } = req.query;
            if (userId && date) {
                const status = await sharedService.getClockStatusByUserIdAndDate(userId, date);
                return res.status(200).json(status);
            }
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },

    // GET CLOCK IN TIME BY USER-ID AND DATE
    async getClockInTimeByUserIdAndDate(req, res) {
        try {
            const { userId, date } = req.query;
            if (userId && date) {
                const time = await sharedService.getClockInTimeByUserIdAndDate(userId, date);
                return res.status(200).json(time);
            }
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },

    // ADD DAILY PROGRESS OF EMPLOYEES
    async addDailyProgress(req, res) {
        try {
            const progressDetails = req.body;
            const userId = progressDetails[1]
            const progressDetailObj = progressDetails[0]
            const date = progressDetails[2]
            const progress = await sharedService.addDailyProgress(userId, progressDetailObj, date);
            return res.status(200).json(progress);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },

    // ADD DAILY PROGRESS OF EMPLOYEES
    async checkProgress(req, res) {
        try {
            const { userId, date, startTime, endTime } = req.body;
            const progress = await sharedService.checkProgress(userId, startTime, date, endTime);
            return res.status(200).json(progress);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },

    // GET DAILY PROGRESS OF EMPLOYEES
    async getProgressDetail(req, res) {
        try {
            const { attendanceId, date } = req.query;
            const progress = await sharedService.getProgressDetail(attendanceId, date);
            return res.status(200).json(progress);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },


}
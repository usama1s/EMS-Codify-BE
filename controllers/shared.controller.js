
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

    // CHECK DAILY PROGRESS OF EMPLOYEES
    async checkProgress(req, res) {
        try {
            const { userId, date, startTime, endTime } = req.query;
            const progress = await sharedService.checkProgress(userId, startTime, date, endTime);
            return res.status(200).json(progress);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },

    // ADD DAILY PROGRESS OF EMPLOYEES
    async checkAllProgressEntered(req, res) {
        try {
            const { userId, date, allStartTime } = req.query;
            const progress = await sharedService.checkAllProgressEntered(userId, allStartTime, date);
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

    // APPLY FOR LEAVES
    async applyLeave(req, res) {
        try {
            const { userId, from, till, category } = req.body;
            const application = await sharedService.applyLeave(userId, from, till, category);
            return res.status(200).json(application.message);
        } catch (error) {
            console.error("Error while appling leave", error);
            return res.status(401).json({ error: "Failed " });
        }
    },

    // GET ALL PENDING LEAVES
    async getAllPendingleaves(req, res) {
        try {
            const allPendingleaves = await sharedService.getAllPendingleaves();
            return res.status(200).json(allPendingleaves);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },

    // UPDATE LEAVE STATUS
    async updateLeaveStatus(req, res) {
        try {
            const { leaveId, status } = req.body
            const allPendingleaves = await sharedService.updateLeaveStatus(leaveId, status);
            return res.status(200).json(allPendingleaves);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },

     // GET ALL LEAVES APPLIED
     async getAllLeavesAppliedByUserId(req, res) {
        try {
            const{userId}=req.query
            const allPendingleaves = await sharedService.getAllLeavesAppliedByUserId(userId);
            return res.status(200).json(allPendingleaves);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },
    
}
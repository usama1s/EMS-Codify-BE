const adminService = require("../services/admin.service");


module.exports = {

    // GET ALL MANAGERS ATTENDANCE
    async getAllManagerAttendance(req, res) {
        try {
            const { year, month } = req.query;
            const attendance = await adminService.getAllManagerAttendance(year, month);
            return res.status(200).json(attendance);
        } catch (error) {
            console.error("Error getting manager attendance:", error);
            return res.status(401).json({ error: "Failed to get attendance" });
        }
    },
    

    async getAllManagers(req, res) {
        try {
            const attendance = await adminService.getAllManagers();
            return res.status(200).json(attendance);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed add attencdence" });
        }
    },

}
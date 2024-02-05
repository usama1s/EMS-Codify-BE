
const managerService = require("../services/manager.service");


module.exports = {

    // GET ALL MANAGERS ATTENDANCE
    async getManagerAttendanceByUserId(req, res) {
        try {
            const { userId } = req.params;
            const managerAttendance = await managerService.getManagerAttendanceByUserId(userId);
            return res.status(200).json(managerAttendance);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed add attencdence" });
        }
    },

    // async getAllManagers(req, res) {
    //     try {
    //         const attendance = await adminService.getAllManagers();
    //         return res.status(200).json(attendance);
    //     } catch (error) {
    //         console.error("Error creating user:", error);
    //         return res.status(401).json({ error: "Failed add attencdence" });
    //     }
    // },

}
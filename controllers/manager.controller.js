
const managerService = require("../services/manager.service");


module.exports = {

    // GET ALL MANAGERS ATTENDANCE
    // async getAttendanceByUserId(req, res) {
    //     try {
    //         const { userId } = req.query;
    //         const managerAttendance = await managerService.getAttendanceByUserId(userId);
    //         return res.status(200).json(managerAttendance);
    //     } catch (error) {
    //         console.error("Error creating user:", error);
    //         return res.status(401).json({ error: "Failed add attencdence" });
    //     }
    // },

    // GET ALL EMPLOYEE
    async getAllEmployee(req, res) {
        try {
            const employees = await managerService.getAllEmployee();
            return res.status(200).json(employees);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: error });
        }
    },

    // REGISTER EMPLOYEE
    async registerEmployee(req, res) {
        try {
            const userDetail = req.body;
            const registrationResult = await managerService.registerEmployee(userDetail);
            return res.status(200).json({ message: registrationResult.message });
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed to create user" });
        }
    },

    // GET ALL MANAGERS ATTENDANCE
    async getAllEmployeesAttendance(req, res) {
        try {
            const { year, month } = req.query
            const attendance = await managerService.getAllEmployeesAttendance(year,month);
            return res.status(200).json(attendance);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },
}
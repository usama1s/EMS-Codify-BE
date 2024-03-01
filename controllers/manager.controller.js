
const managerService = require("../services/manager.service");


module.exports = {

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

    // REGISTER NORMAL EMPLOYEES 
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
            const attendance = await managerService.getAllEmployeesAttendance(year, month);
            return res.status(200).json(attendance);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },

    // ADD ASSETS
    async addAsset(req, res) {
        try {
            const assetData = req.body
            const assets = await managerService.addAsset(assetData);
            return res.status(200).json(assets);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },

     // GET ALL ASSETS
     async getAllAsset(req,res) {
        try {
            const assets = await managerService.getAllAsset();
            return res.status(200).json(assets);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },

     // GET ALL USERS
     async getUsers(req, res) {
        try {
            const users = await managerService.getUsers();
            return res.status(200).json(users);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: error });
        }
    },

    // ADD ASSETS
    async allotAsset(req, res) {
        try {
            const allotmentData = req.body
            const assets = await managerService.allotAsset(allotmentData);
            return res.status(200).json(assets);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },
}
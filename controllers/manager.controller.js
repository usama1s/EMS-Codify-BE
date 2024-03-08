
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
    async getAllAsset(req, res) {
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

    // ALLOTMENT OF ASSETS
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

    // GET ALL ASSETS WHICH ARE NOT ALLOTED
    async getAllAssetNotAlloted(req, res) {
        try {
            const assets = await managerService.getAllAssetNotAlloted();
            return res.status(200).json(assets);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },

    // GET ALL ALLOTED ASSETS
    async getAllAllottedAsset(req, res) {
        try {
            const assets = await managerService.getAllAllottedAsset();
            return res.status(200).json(assets);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed " });
        }
    },

    // GET ALL MANAGERS
    async getAllManagers(req, res) {
        try {
            const attendance = await managerService.getAllManagers();
            return res.status(200).json(attendance);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed add attencdence" });
        }
    },

    // GET ALL EMPLOYEE WITHOUT ACTIVE CONTRACT
    async getAllEmployeeWithoutActiveContract(req, res) {
        try {
            const usersWithoutContract = await managerService.getAllUsersWithoutActiveContract();
            return res.status(200).json(usersWithoutContract);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: error });
        }
    },


    // CREATE EMPLOYEE CONTRACT
    async createContact(req, res) {
        try {
            const contractDetail = req.body
            const contract = await managerService.createContact(contractDetail);
            return res.status(200).json(contract);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed add attencdence" });
        }
    },

    // GET ALL CONTRACTS OF SPECIFIC USER
    async getAllUserContracts(req, res) {
        try {
            const { userId } = req.query
            const contracts = await managerService.getAllUserContracts(userId);
            return res.status(200).json(contracts);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: error });
        }
    },

    // CHANGE CONTRACT STATUS
    async changeContactStatus(req, res) {
        try {
            const { contractId, status } = req.body
            const contract = await managerService.changeContactStatus(contractId, status );
            return res.status(200).json(contract);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed add attencdence" });
        }
    },

    // GET ALL ACTIVE CONTRACTS
    async getAllActiveContractsWithPay(req, res) {
        try {
            const contracts = await managerService.getAllActiveContractsWithPay();
            return res.status(200).json(contracts);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: error });
        }
    },

    // PAY EMPLOYEE SALARY
    async paySalary(req, res) {
        try {
            const salaryDetail = req.body
            const salary = await managerService.paySalary(salaryDetail);
            return res.status(200).json(salary);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed add attencdence" });
        }
    },


}
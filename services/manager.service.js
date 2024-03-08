const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const utils = require('../utils/utils');




module.exports = {

    // GET MANAGERS ATTENDANCE BY USER ID
    async getAttendanceByUserId(userId) {
        try {
            const modifiedAttendance = [];
            const [attendances] = await pool.query(sql.GET_ATTENDANCE_BY_USER_ID, [userId]);

            if (attendances) {

                const groupedAttendances = {};

                for (const attendance of attendances) {
                    const filename = utils.extractFilenameFromURL(attendance.attendance_picture);
                    const base64 = utils.convertFileIntoBase64(filename);
                    attendance.attendance_picture = base64;

                    const userId = attendance.user_id;
                    if (!(userId in groupedAttendances)) {
                        groupedAttendances[userId] = {
                            attendance_id: attendance.attendance_id,
                            user_id: userId,
                            attendance: [],
                            time_zone: attendance.time_zone,
                            first_name: attendance.first_name,
                            last_name: attendance.last_name,
                            email: attendance.email,
                            password: attendance.password,
                            user_type: attendance.user_type,
                            designation: attendance.designation,
                            date_of_joining: attendance.date_of_joining,
                            profile_picture: attendance.profile_picture,
                        };
                    }

                    const attendanceDateTime = new Date(attendance.attendance_date_time);
                    const time = attendanceDateTime.toISOString().slice(11, 19); // Extracts hours, minutes, and seconds
                    const date = attendanceDateTime.toISOString().split('T')[0];

                    const clockType = attendance.clock_type;
                    const clockRecord = {
                        time: time,
                        location: attendance.location,
                        clock_type: clockType,
                        attendance_picture: attendance.attendance_picture,
                    };

                    // Push the attendance record to the array for the corresponding user_id
                    if (clockType === 'CI') {
                        groupedAttendances[userId].attendance.push({
                            date: date,
                            ClockIn: [clockRecord],
                            ClockOut: [],
                        });
                    } else if (clockType === 'CO') {
                        // Find the corresponding attendance record and push the clock record to ClockOut array
                        const attendanceRecord = groupedAttendances[userId].attendance.find(record => record.date === date);
                        if (attendanceRecord) {
                            attendanceRecord.ClockOut.push(clockRecord);
                        }
                    }
                }

                // Convert the dictionary values to an array
                modifiedAttendance.push(...Object.values(groupedAttendances));

                return modifiedAttendance;
            }
        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // GET ALL EMPLOYEE
    async getAllEmployee() {
        try {
            const [employees] = await pool.query(sql.GET_ALL_EMPLOYEE);
            return employees;

        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // REGISTER NORMAL EMPLOYEES 
    async registerEmployee(userDetail) {
        try {
            const {
                email,
                password,
                designation,
                first_name,
                last_name,
                date_of_joining,
            } = userDetail;

            const [isUserRegistered] = await pool.query(sql.CHECK_USER_REGISTERED, [
                email,
                3,
            ]);
            if (!isUserRegistered.length) {
                const [registerUser] = await pool.query(sql.INSERT_INTO_USERS, [first_name, last_name, email, password, 3, designation, date_of_joining]);
                return { message: "Employee Created Successfully" }
            } else {
                return { message: "Employee Already Registered " }
            }
        }

        catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // GET ALL EMPLOYEES ATTENDANCE   
    async getAllEmployeesAttendance(year, month) {
        try {
            const modifiedAttendance = [];
            const [attendances] = await pool.query(sql.GET_ALL_EMPLOYEE_ATTENDANCE_AND_PROGRESS, [year, year, month, month]);

            if (attendances) {
                // Create a dictionary to store attendance records based on user_id
                const groupedAttendances = {};

                for (const attendance of attendances) {
                    const filename = utils.extractFilenameFromURL(attendance.attendance_picture);
                    const base64 = utils.convertFileIntoBase64(filename);
                    attendance.attendance_picture = base64;

                    const userId = attendance.user_id;

                    // Check if the user_id key exists in the dictionary
                    if (!(userId in groupedAttendances)) {
                        // If not, initialize an object for that user_id
                        groupedAttendances[userId] = {
                            user_id: userId,
                            attendance: [],
                            time_zone: attendance.time_zone,
                            first_name: attendance.first_name,
                            last_name: attendance.last_name,
                            email: attendance.email,
                            password: attendance.password,
                            user_type: attendance.user_type,
                            designation: attendance.designation,
                            date_of_joining: attendance.date_of_joining,
                            profile_picture: attendance.profile_picture,
                        };
                    }

                    const attendanceDateTime = new Date(attendance.attendance_date_time);
                    const time = attendanceDateTime.toISOString().slice(11, 19); // Extracts hours, minutes, and seconds
                    const date = attendanceDateTime.toISOString().split('T')[0];

                    const clockType = attendance.clock_type;
                    const clockRecord = {
                        time: time,
                        location: attendance.location,
                        clock_type: clockType,
                        attendance_picture: attendance.attendance_picture,
                    };

                    // Find the corresponding attendance record for the date
                    let attendanceRecord = groupedAttendances[userId].attendance.find(record => record.date === date);

                    // If attendance record for the date doesn't exist, create a new one
                    if (!attendanceRecord) {
                        attendanceRecord = {
                            attendance_id: attendance.attendance_id,
                            date: date,
                            ClockIn: [],
                            ClockOut: [],
                            Progress: [], // Include Progress array
                        };
                        groupedAttendances[userId].attendance.push(attendanceRecord);
                    }

                    // Check if the clock record already exists for the same date and time
                    const isDuplicateClockRecord = attendanceRecord.ClockIn.some(record =>
                        record.time === time && record.clock_type === 'CI'
                    ) || attendanceRecord.ClockOut.some(record =>
                        record.time === time && record.clock_type === 'CO'
                    );

                    // If the clock record is not a duplicate, push it to the appropriate array
                    if (!isDuplicateClockRecord) {
                        if (clockType === 'CI') {
                            attendanceRecord.ClockIn.push(clockRecord);
                        } else if (clockType === 'CO') {
                            attendanceRecord.ClockOut.push(clockRecord);
                        }
                    }

                    // Add progress details to the attendance record
                    const progressRecord = {
                        start_time: attendance.start_time,
                        end_time: attendance.end_time,
                        title: attendance.title,
                        description: attendance.description,
                    };

                    // Check if the progress record already exists for the same date, start time, and end time
                    const isDuplicateProgressRecord = attendanceRecord.Progress.some(record =>
                        record.start_time === progressRecord.start_time &&
                        record.end_time === progressRecord.end_time &&
                        record.title === progressRecord.title &&
                        record.description === progressRecord.description
                    );

                    // If the progress record is not a duplicate, push it to the Progress array
                    if (!isDuplicateProgressRecord) {
                        attendanceRecord.Progress.push(progressRecord);
                    }
                }

                // Convert the dictionary values to an array
                modifiedAttendance.push(...Object.values(groupedAttendances));

                return modifiedAttendance;
            } else {
                return ("no attendances available")
            }
        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // ADD ASSETS
    async addAsset(assetData) {
        try {

            const { userId, title, description, company, pictures, date } = assetData
            let base64Array = [];
            const [addAsset] = await pool.query(sql.INSERT_INTO_ASSETS, [userId, title, description, company, date]);
            const assetId = addAsset.insertId
            let i;
            for (i = 0; i < 7; i++) {
                if (pictures[i]) {
                    const assetFilePath = await utils.base64ToJpg(pictures[i]);
                    base64Array.push(assetFilePath);
                } else {
                    base64Array.push(null);
                }
            }
            await pool.query(sql.INSERT_INTO_ASSET_FILES, [assetId, ...base64Array]);
            return { message: "Asset Added" }
        }

        catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // GET ALL ASSETS
    async getAllAsset() {
        try {
            const [assets] = await pool.query(sql.GET_ALL_ASSETS);
            const picturesArrayBase64 = [];
            for (const asset of assets) {

                // const [isAssetAlloted] = await pool.query(sql.GET_ALLOTED_ASSET_BY_ASSET_ID, [asset.asset_id]);

                // if (isAssetAlloted.length == 0) {

                const assetObject = {
                    assetId: asset.asset_id,
                    title: asset.asset_title,
                    description: asset.asset_description,
                    company: asset.asset_company,
                    pictures: []
                };

                const pictures = [
                    asset.picture_1,
                    asset.picture_2,
                    asset.picture_3,
                    asset.picture_4,
                    asset.picture_5,
                    asset.picture_6,
                    asset.picture_7
                ];

                for (const picture of pictures) {
                    if (picture !== null) {
                        const pictureUrl = picture;
                        const pictureFilepath = utils.extractFilenameFromURL(pictureUrl);
                        const pictureBase64 = utils.convertFileIntoBase64(pictureFilepath);
                        assetObject.pictures.push(pictureBase64);
                    } else {
                        assetObject.pictures.push(null);
                    }

                };

                picturesArrayBase64.push(assetObject);
                // }
            };

            return picturesArrayBase64;
        } catch (error) {
            console.error("Error retrieving assets:", error);
            throw error;
        }
    },

    // GET ALL USERS
    async getUsers() {
        try {
            const [users] = await pool.query(sql.GET_ALL_USERS, [2, 3]);
            return users;

        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // ALLOTMENT OF ASSETS
    async allotAsset(allotmentData) {
        try {
            const { assetId, pictures, userId, date, title, description } = allotmentData
            let allotFile1;
            let allotFile2;
            if (pictures[0]) {
                allotFile1 = await utils.base64ToJpg(pictures[0]);
            }
            if (pictures[1]) {
                allotFile2 = await utils.base64ToJpg(pictures[1]);
            }
            const [allot] = await pool.query(sql.INSERT_INTO_ALLOT_ASSET, [assetId, userId, allotFile1 ? allotFile1 : null, allotFile2 ? allotFile2 : null, title, description, date]);
            return { message: "Asset Alloted" };
        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // GET ALL ASSETS WHICH ARE NOT ALLOTED
    async getAllAssetNotAlloted() {
        try {
            const [assets] = await pool.query(sql.GET_ALL_ASSETS);
            const picturesArrayBase64 = [];
            for (const asset of assets) {

                const [isAssetAlloted] = await pool.query(sql.GET_ALLOTED_ASSET_BY_ASSET_ID, [asset.asset_id]);

                if (isAssetAlloted.length == 0) {

                    const assetObject = {
                        assetId: asset.asset_id,
                        title: asset.asset_title,
                        description: asset.asset_description,
                        company: asset.asset_company,
                        pictures: []
                    };

                    const pictures = [
                        asset.picture_1,
                        asset.picture_2,
                        asset.picture_3,
                        asset.picture_4,
                        asset.picture_5,
                        asset.picture_6,
                        asset.picture_7
                    ];

                    for (const picture of pictures) {
                        if (picture !== null) {
                            const pictureUrl = picture;
                            const pictureFilepath = utils.extractFilenameFromURL(pictureUrl);
                            const pictureBase64 = utils.convertFileIntoBase64(pictureFilepath);
                            assetObject.pictures.push(pictureBase64);
                        } else {
                            assetObject.pictures.push(null);
                        }

                    };

                    picturesArrayBase64.push(assetObject);
                }
            };

            return picturesArrayBase64;
        } catch (error) {
            console.error("Error retrieving assets:", error);
            throw error;
        }
    },

    // GET ALL ALLOTED ASSETS
    async getAllAllottedAsset() {
        try {
            const [assets] = await pool.query(sql.GET_ALL_ALLOTED_ASSET);
            const picturesArrayBase64 = [];
            for (const asset of assets) {
                const assetObject = {
                    firstName: asset.first_name,
                    lastName: asset.last_name,
                    assetId: asset.asset_id,
                    title: asset.asset_title,
                    description: asset.asset_description,
                    company: asset.asset_company,
                    pictures: []
                };

                const pictures = [
                    asset.picture_1,
                    asset.picture_2,
                    asset.picture_3,
                    asset.picture_4,
                    asset.picture_5,
                    asset.picture_6,
                    asset.picture_7
                ];

                for (const picture of pictures) {
                    if (picture !== null) {
                        const pictureUrl = picture;
                        const pictureFilepath = utils.extractFilenameFromURL(pictureUrl);
                        const pictureBase64 = utils.convertFileIntoBase64(pictureFilepath);
                        assetObject.pictures.push(pictureBase64);
                    } else {
                        assetObject.pictures.push(null);
                    }

                };
                picturesArrayBase64.push(assetObject);
            };

            return picturesArrayBase64;
        } catch (error) {
            console.error("Error retrieving assets:", error);
            throw error;
        }
    },

    // GET ALL MANAGERS REGISTERED  
    async getAllManagers() {
        try {
            const managerMap = new Map();
            const [managers] = await pool.query(sql.GET_ALL_MANAGERS, [2]);

            managers.forEach(manager => {
                const existingManager = managerMap.get(manager.user_id);

                if (existingManager) {
                    existingManager.roles.push(manager.role);
                } else {
                    managerMap.set(manager.user_id, {
                        "user_id": manager.user_id,
                        "first_name": manager.first_name,
                        "last_name": manager.last_name,
                        "email": manager.email,
                        "password": manager.password,
                        "user_type": manager.user_type,
                        "roles": [manager.role],
                        "designation": manager.designation,
                        "date_of_joining": ""
                    });
                }
            });

            const modifiedManagers = Array.from(managerMap.values());
            return modifiedManagers;

        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // GET ALL EMPLOYEE WITHOUT ACTIVE CONTRACT
    async getAllUsersWithoutActiveContract() {
        try {
            const [users] = await pool.query(sql.GET_ALL_USER_FOR_CONTRACT);
            let usersWithoutContract = []
            for (const user of users) {
                const [isActive] = await pool.query(sql.GET_USER_WITH_CONTRACTS, [user.user_id]);
                if (isActive.length == 0) {
                    usersWithoutContract.push(user)
                }
            }
            return usersWithoutContract;

        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // CREATE EMPLOYEES CONTRACT
    async createContact(contractDetail) {
        try {
            const { employeeId, managerId, startDate, endDate, pay, pdf } = contractDetail;
            let fileName;
            if (pdf) {
                fileName = await utils.base64ToPdf(pdf);
            } else {
                fileName = null
            }
            const [contract] = await pool.query(sql.INSERT_INTO_EMPLOYEE_CONTRACT, [employeeId, managerId, startDate, endDate, pay, fileName]);
            if (contract.affectedRows == 1) {
                const [emailResult] = await pool.query(sql.GET_USER_DATA_BY_USER_ID, [employeeId]);
                const email = emailResult[0].email;
                let status = "contract"
                let sendEmail = utils.sendEmail(email, status);
                if (sendEmail) {
                    return { message: "Email sent" };
                }
            }
        }

        catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // GET ALL CONTRACTS OF SPECIFIC USER
    async getAllUserContracts(userId) {
        try {
            let allContracts = []
            const [contracts] = await pool.query(sql.GET_USER_CONTRACTS_BY_USER_ID, [userId]);
            for (const contract of contracts) {
                const [managerData] = await pool.query(sql.GET_USER_DATA_BY_USER_ID, [contract.reporting_manager_from_users]);
                const pdfFileName = utils.extractFilenameFromURL(contract.signed_contract_pdf)
                const pdfBase64 = utils.convertFileIntoBase64(pdfFileName)
                let fullContratDetail = {
                    contractId: contract.employee_contract_id,
                    userId: contract.user_id,
                    reportingManager: managerData[0].first_name + managerData[0].last_name,
                    contractStartDate: contract.contract_start_date,
                    contractEndDate: contract.contract_end_date,
                    pay: contract.pay,
                    pdf: pdfBase64,
                    contractStatus: contract.contract_status
                }
                allContracts.push(fullContratDetail);
            }
            return allContracts;
        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // CHANGE CONTRACT STATUS
    async changeContactStatus(contractId, status) {
        try {
            const [contract] = await pool.query(sql.CHANGE_CONTRACT_STATUS, [status, contractId]);
            if (contract.affectedRows == 1) {
                return { message: "Contract status changed" }
            }
        }

        catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // GET ALL ACTIVE CONTRACTS
    async getAllActiveContractsWithPay() {
        try {
            let allActiveContracts = []
            let taxAmount;
            let monthYear = await utils.getCurrentMonthYear();
            let SalaryAfterTax;
            let pdfBase64;
            let pdfFileName;
            const [contracts] = await pool.query(sql.GET_ALL_ACTIVE_CONTRACTS);
            for (const contract of contracts) {
                const [isPaid] = await pool.query(sql.GET_ALL_SALARY_PAID, [contract.user_id, monthYear.monthName, monthYear.year]);
                if (isPaid.length == 0) {
                    const [contractData] = await pool.query(sql.GET_USER_DATA_BY_USER_ID, [contract.user_id]);
                    if (pdfFileName) {
                        pdfFileName = utils.extractFilenameFromURL(contract.signed_contract_pdf);
                        pdfBase64 = utils.convertFileIntoBase64(pdfFileName);
                    }
                    taxAmount = await utils.calculateMonthlyTax(contract.pay);
                    SalaryAfterTax = contract.pay - taxAmount;
                    let fullContratDetail = {
                        contractId: contract.employee_contract_id,
                        userId: contract.user_id,
                        fullName: contractData[0].first_name + contractData[0].last_name,
                        contractStartDate: contract.contract_start_date,
                        contractEndDate: contract.contract_end_date,
                        pay: contract.pay,
                        tax: taxAmount,
                        month: monthYear.monthName,
                        year: monthYear.year,
                        pdf: pdfBase64,
                        contractStatus: contract.contract_status
                    }
                    allActiveContracts.push(fullContratDetail);
                }
            }
            return allActiveContracts;
        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // PAY EMPLOYEE SALARY
    async paySalary(salaryDetail) {
        try {
            const { amount, month, tax, totalPaid, bonus, userId, pdfBase64, year } = salaryDetail;
            let fileName;
            if (pdfBase64) {
                fileName = await utils.base64ToPdf(pdfBase64);
            } else {
                fileName = null
            }
            const [salary] = await pool.query(sql.INSERT_INTO_SALARY_PAYMENT, [userId, month, amount, bonus, tax, totalPaid, fileName, year]);
            if (salary.affectedRows == 1) {
                const [emailResult] = await pool.query(sql.GET_USER_DATA_BY_USER_ID, [userId]);
                const email = emailResult[0].email;
                let status = "salary"
                let sendEmail = utils.sendEmail(email, status);
                if (sendEmail) {
                    return { message: "Email sent" };
                }
            }
        }

        catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

}
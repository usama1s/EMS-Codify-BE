const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const convertBase64 = require('../utils/utils');



module.exports = {

    // GET MANAGERS ATTENDANCE BY USER ID
    async getAttendanceByUserId(userId) {
        try {
            const modifiedAttendance = [];
            const [attendances] = await pool.query(sql.GET_ATTENDANCE_BY_USER_ID, [userId]);

            if (attendances) {

                const groupedAttendances = {};

                for (const attendance of attendances) {
                    const filename = convertBase64.extractFilenameFromURL(attendance.attendance_picture);
                    const base64 = convertBase64.convertFileIntoBase64(filename);
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
            const managerMap = new Map();
            const [employees] = await pool.query(sql.GET_ALL_EMPLOYEE, [3]);
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
                const userId = registerUser.insertId
                await pool.query(sql.INSERT_INTO_EMPLOYEE, [userId]);

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
                    const filename = convertBase64.extractFilenameFromURL(attendance.attendance_picture);
                    const base64 = convertBase64.convertFileIntoBase64(filename);
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
    async addAsset(userDetail) {
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
                const userId = registerUser.insertId
                await pool.query(sql.INSERT_INTO_EMPLOYEE, [userId]);

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
}
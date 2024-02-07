const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const convertBase64 = require('../utils/utils');



module.exports = {

    // GET ATTENDANCE BY USER ID
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

    async getClockStatusByUserIdAndDate(userId, date) {
        try {
            const [clockInStatus] = await pool.query(sql.GET_CLOCKIN_STATUS_BY_USERID_AND_DATE, [userId, date]);

            if (clockInStatus.length > 0) {
                return clockInStatus[0];
            }
            else {
                return { message: "Not clocked in" }
            }

        }
        catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    async getClockInTimeByUserIdAndDate(userId, date) {
        try {
            const [clockInTime] = await pool.query(sql.GET_CLOCKIN_TIME_BY_USERID_AND_DATE, [userId, date]);
            if (clockInTime.length > 0) {
                const timestamp = clockInTime[0].attendance_date_time; // Assuming timestamp is the key holding the date/time value
                const time = new Date(timestamp);
                const hours = time.getHours();
                const minutes = time.getMinutes();
                const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
                return formattedTime;
            }
        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // ADD DAILY PROGRESS
    async addDailyProgress(userId, progressDetailArray, date) {
        try {
            const [employeeId] = await pool.query(sql.GET_EMPLOYEE_ID, [userId]);
            const empId = employeeId[0].employee_id
            const [employeeProgress] = await pool.query(sql.INSERT_INTO_EMPLOYEE_PROGRESS, [empId, date]);
            const employeeProgressId = employeeProgress.insertId
            for (const progressDetail of progressDetailArray) {
                const [employeeProgressDetails] = await pool.query(sql.INSERT_INTO_EMPLOYEE_PROGRESS_DETAILS,
                    [
                        employeeProgressId,
                        progressDetail.startTime,
                        progressDetail.title,
                        progressDetail.description,
                        progressDetail.endTime,
                    ]
                );
            }
            return { message: "Progress Added Successfully" }
        }
        catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

}
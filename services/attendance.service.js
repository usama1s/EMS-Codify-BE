const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const utils = require('../utils/utils');


module.exports = {
    async insertAttendance(attendanceDetail, attendanceFilePath) {
        try {
            const { user_id, location } = attendanceDetail;
            const concatLocation = `${location.latitude},${location.longitude}`;

            // Get the current date and time in EST
            const date_time_ET = utils.getCurrentDateTimeWithTimeZone();
            const currentDate = new Date(date_time_ET.currentDate)
            const timeZone = date_time_ET.timeZone

            // Get the most recent attendance time from the database
            const [most_recent_attendance_time_result] = await pool.query(sql.CHECK_MOST_RECENT_ATTENDANCE_TIME, [user_id]);
            const most_recent_attendance_time = most_recent_attendance_time_result[0]?.attendance_date_time;
            const most_recent_timezone = most_recent_attendance_time_result[0]?.time_zone;

            // Check if the difference in hours is greater than or equal to 24
            if (most_recent_attendance_time) {
                const most_recent_attendance_time_ET = utils.convertToEST(new Date(most_recent_attendance_time), most_recent_timezone);
                const diffInHours = Math.abs(new Date(currentDate) - new Date(most_recent_attendance_time_ET)) / 3600000;
                if (diffInHours >= 24) {
                    // Allow the user to mark attendance again
                    await pool.query(sql.INSERT_INTO_ATTENDANCE, [user_id, attendanceFilePath, concatLocation, currentDate, timeZone]);
                    return { message: "Attendance added successfully" };
                } else {
                    // User cannot mark attendance again within 24 hours
                    return { message: "Cannot mark attendance again within 24 hours" };
                }
            } else {
                // If there is no most recent attendance time, allow the user to mark attendance
                await pool.query(sql.INSERT_INTO_ATTENDANCE, [user_id, attendanceFilePath, concatLocation, currentDate, timeZone]);
                return { message: "Attendance added successfully" };
            }
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    async clockOut(attendanceDetail, attendanceFilePath) {
        try {
            const { user_id, location } = attendanceDetail;
            const concatLocation = `${location.latitude},${location.longitude}`;
            // Get the current date and time in EST
            const date_time_ET = utils.getCurrentDateTimeWithTimeZone();
            const currentDate = new Date(date_time_ET.currentDate)
            const timeZone = date_time_ET.timeZone
            await pool.query(sql.INSERT_INTO_ATTENDANCE, [user_id, attendanceFilePath, concatLocation, currentDate, timeZone]);
            return { message: "Clocked Out Successfully" };
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },


    async getClockInTime(user_id) {
        try {
            // Get the most recent attendance time from the database
            const [most_recent_attendance_time_result] = await pool.query(sql.CHECK_MOST_RECENT_ATTENDANCE_TIME, [user_id]);
            const most_recent_attendance_time = most_recent_attendance_time_result[0]?.attendance_date_time;
            const most_recent_timezone = most_recent_attendance_time_result[0]?.time_zone;

            if (most_recent_attendance_time) {
                const most_recent_attendance_time_ET = utils.convertToEST(new Date(most_recent_attendance_time), most_recent_timezone);
                return most_recent_attendance_time_ET
            }
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },


}
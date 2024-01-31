const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const utils = require('../utils/utils');


module.exports = {

    // CLOCK IN
    async insertAttendance(attendanceDetail) {
        try {
            const { user_id, location, clock_type, attendance_picture } = attendanceDetail;
            const concatLocation = `${location.latitude},${location.longitude}`;

            // Get the current date and time in EST
            const date_time_ET = utils.getCurrentDateTimeWithTimeZone();
            const currentDate = new Date(date_time_ET.currentDate)
            const timeZone = date_time_ET.timeZone

            // Get the most recent attendance time from the database
            const [most_recent_attendance_time_result] = await pool.query(sql.CHECK_MOST_RECENT_ATTENDANCE_TIME, [user_id, clock_type]);
            const most_recent_attendance_time = most_recent_attendance_time_result[0]?.attendance_date_time;
            const most_recent_timezone = most_recent_attendance_time_result[0]?.time_zone;

            // Check if the difference in hours is greater than or equal to 24
            if (most_recent_attendance_time) {
                const most_recent_attendance_time_ET = utils.convertToEST(new Date(most_recent_attendance_time), most_recent_timezone);
                const diffInHours = Math.abs(new Date(currentDate) - new Date(most_recent_attendance_time_ET)) / 3600000;
                if (diffInHours >= 24) {
                    const attendanceFilePath = await utils.base64ToJpg(attendance_picture);
                    await pool.query(sql.INSERT_INTO_ATTENDANCE, [user_id, attendanceFilePath, concatLocation, currentDate, timeZone, clock_type]);
                    return { message: "Attendance added successfully" };
                } else {
                    // User cannot mark attendance again within 24 hours
                    return { message: "Cannot mark attendance again within 24 hours" };
                }
            } else {
                const attendanceFilePath = await utils.base64ToJpg(attendance_picture);
                await pool.query(sql.INSERT_INTO_ATTENDANCE, [user_id, attendanceFilePath, concatLocation, currentDate, timeZone, clock_type]);
                return { message: "Attendance added successfully" };
            }
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // CLOCK OUT
    async clockOut(attendanceDetail) {
        try {
            const { user_id, location, clock_type,attendance_picture } = attendanceDetail;
            const concatLocation = `${location.latitude},${location.longitude}`;

            const date_time_ET = utils.getCurrentDateTimeWithTimeZone();
            const currentDate = new Date(date_time_ET.currentDate)
            const timeZone = date_time_ET.timeZone

            const [most_recent_attendance_time_result] = await pool.query(sql.CHECK_MOST_RECENT_ATTENDANCE_TIME, [user_id, clock_type]);
            const most_recent_attendance_time = most_recent_attendance_time_result[0]?.attendance_date_time;
            const most_recent_timezone = most_recent_attendance_time_result[0]?.time_zone;

            if (most_recent_attendance_time) {
                const most_recent_attendance_time_ET = utils.convertToEST(new Date(most_recent_attendance_time), most_recent_timezone);
                const diffInHours = Math.abs(new Date(currentDate) - new Date(most_recent_attendance_time_ET)) / 3600000;
                if (diffInHours >= 22) {
                    // Allow the user to mark attendance again
                    const attendanceFilePath = await utils.base64ToJpg(attendance_picture);
                    await pool.query(sql.INSERT_INTO_ATTENDANCE, [user_id, attendanceFilePath, concatLocation, currentDate, timeZone, clock_type]);
                    return { message: "Attendance added successfully" };
                } else {
                    // User cannot mark attendance again within 24 hours
                    return { message: "Cannot mark attendance again within 22 hours" };
                }
            } else {
                const attendanceFilePath = await utils.base64ToJpg(attendance_picture);
                await pool.query(sql.INSERT_INTO_ATTENDANCE, [user_id, attendanceFilePath, concatLocation, currentDate, timeZone, clock_type]);
                return { message: "Clocked Out Successfully" };
            }
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // GET AT WHAT TIME THE USER CLOCKED-IN
    async getClockInTime(user_id, clock_type) {
        try {
            // Get the most recent attendance time from the database
            const [most_recent_attendance_time_result] = await pool.query(sql.CHECK_MOST_RECENT_ATTENDANCE_TIME, [user_id, clock_type]);
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
const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");


module.exports = {

    // INSERT ATTENDENCE
    async insertAttendance(attendenceDetail, attendanceFilePath) {
        try {
            const { user_id, location } = attendenceDetail;
            // const [time] = await pool.query(sql.CHECK_MOST_RECENT_ATTENDANCE_TIME, [user_id]);
            // const mostRecentAttendanceTime = time[0]?.attendance_time;
            // const [hours, minutes, seconds] = mostRecentAttendanceTime.split(':');
            // const mostRecentAttendanceInSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
            // const currentTime = new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds();
            // const timeDifferenceInSeconds = currentTime - mostRecentAttendanceInSeconds;
            // const timeDifferenceInHours = timeDifferenceInSeconds / 3600;
            // if (timeDifferenceInHours >= 6) {
            let concatLocation = `${location.latitude},${location.longitude}`;
            await pool.query(sql.INSERT_INTO_ATTENDANCE, [user_id, attendanceFilePath, concatLocation]);
            return { message: "Attendance added successfully" };
            // } else {
            //     return { message: "Attendance not added. Recent attendance within 6 hours." };
            // }
        }
        catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

}
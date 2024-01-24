const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");


module.exports = {

    // INSERT ATTENDENCE
    async insertAttendance(attendenceDetail, attendanceFilePath) {
        try {
            const { user_id, location, attendance_date_time } = attendenceDetail;
            let concatLocation = `${location.latitude},${location.longitude}`;
            await pool.query(sql.INSERT_INTO_ATTENDANCE, [user_id, attendanceFilePath, concatLocation, attendance_date_time]);
            return { message: "Attendence added successfully" }
        }
        catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

}
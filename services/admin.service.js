const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const convertBase64 = require('../utils/convert.base64');



module.exports = {

    // INSERT ATTENDENCE
    async getAllManagerAttendance() {
        try {
            const modifiedAttendance = []
            const [attendances] = await pool.query(sql.GET_ALL_MANAGER_ATTENDANCE);
            if (attendances) {
                for (const attendance of attendances) {
                    const filename = convertBase64.extractFilenameFromURL(attendance.attendance_picture);
                    const base64 = convertBase64.convertFileIntoBase64(filename)
                    attendance.attendance_picture = base64
                    modifiedAttendance.push(attendance);
                }
                return modifiedAttendance
            }

        }
        catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

}
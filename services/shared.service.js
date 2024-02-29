const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const convertBase64 = require('../utils/utils');
const utils = require('../utils/utils');


module.exports = {

    // GET ATTENDANCE BY USER ID
    async getAttendanceByUserId(userId, year, month) {
        try {
            const modifiedAttendance = [];
            const [attendances] = await pool.query(sql.GET_ATTENDANCE_BY_USER_ID, [userId, year, year, month, month]);

            if (attendances) {

                const groupedAttendances = {};

                for (const attendance of attendances) {
                    const filename = convertBase64.extractFilenameFromURL(attendance.attendance_picture);
                    const base64 = convertBase64.convertFileIntoBase64(filename);
                    attendance.attendance_picture = base64;

                    const userId = attendance.user_id;
                    if (!(userId in groupedAttendances)) {
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

                    // Push the attendance record to the array for the corresponding user_id
                    if (clockType === 'CI') {
                        groupedAttendances[userId].attendance.push({
                            attendance_id: attendance.attendance_id,
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
                const timestamp = clockInTime[0].attendance_date_time;
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
    async addDailyProgress(userId, progressDetailObj, date) {
        try {
            let attendanceId
            const [getAttendanceId] = await pool.query(sql.GET_EMPLOYEE_ATTENDANCE_ID, [userId, date]);
            attendanceId = getAttendanceId[0].attendance_id
            const [employeeProgressDetails] = await pool.query(sql.INSERT_INTO_EMPLOYEE_PROGRESS_DETAILS,
                [
                    progressDetailObj.startTime,
                    progressDetailObj.title,
                    progressDetailObj.description,
                    progressDetailObj.endTime,
                    attendanceId,
                ]
            );
            // }
            return { message: "Progress Added Successfully" }
        }
        catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // CHECK PROGRESS IF EXISTS
    async checkProgress(userId, startTime, date, endTime) {
        try {
            const [getAttendanceId] = await pool.query(sql.GET_EMPLOYEE_ATTENDANCE_ID, [userId, date]);
            const attendanceId = getAttendanceId[0].attendance_id
            const [isEmployeeProgress] = await pool.query(sql.CHECK_PROGRESS, [attendanceId, startTime, endTime, date]);
            if (isEmployeeProgress.length > 0) {
                return isEmployeeProgress
            }
            else {
                return false
            }
        }
        catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    async checkAllProgressEntered(userId, allStartTime, date) {
        try {
            const [getAttendanceId] = await pool.query(sql.GET_EMPLOYEE_ATTENDANCE_ID, [userId, date]);
            const attendanceId = getAttendanceId[0].attendance_id;

            let allProgressEntered = true;

            for (const startTime of allStartTime) {
                const [isEmployeeProgress] = await pool.query(sql.CHECK_PROGRESS, [attendanceId, startTime, date, null]);
                if (isEmployeeProgress.length === 0) {
                    allProgressEntered = false;
                    break;
                }
            }

            return allProgressEntered;
        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },


    // GET DAILY PROGRESS OF EMPLOYEES
    async getProgressDetail(attendanceId, date) {
        try {
            const [progressDetails] = await pool.query(sql.GET_EMPLOYEE_PROGRESS_DETAIL, [attendanceId, date]);
            const result = {
                attendance_id: attendanceId,
                attendance_date_time: date,
                progress: []
            };
            for (const progressDetail of progressDetails) {
                const { start_time, end_time, title, description } = progressDetail;
                result.progress.push({ start_time, end_time, title, description });
            }
            return result;
        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // APPLY FOR LEAVES
    async applyLeave(userId, from, till, category) {
        try {
            const [progressDetails] = await pool.query(sql.INSERT_INTO_LEAVE_APPLIED, [userId, from, till, category]);
            return { message: "Application Sent" }
        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // GET ALL PENDING LEAVES
    async getAllPendingleaves(attendanceId, date) {
        try {
            const [allPendingleaves] = await pool.query(sql.GET_ALL_LEAVES, [attendanceId, date]);
            const leaves = []
            let leave_status;
            for (const allPendingLeave of allPendingleaves) {
                const { leave_id, first_name, last_name, leave_category } = allPendingLeave;
                const from_date = new Date(allPendingLeave.from_date).toISOString().split('T')[0];
                const till_date = new Date(allPendingLeave.till_date).toISOString().split('T')[0];
                if (allPendingLeave.leave_status === 1) {
                    leave_status = 'pending'
                }
                else if (allPendingLeave.leave_status === 2) {
                    leave_status = 'approved'
                }
                else if (allPendingLeave.leave_status === 3) {
                    leave_status = 'rejected'
                }
                leaves.push({ leave_id, first_name, last_name, from_date, till_date, leave_category, leave_status });
            }
            return leaves;
        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // UPDATE LEAVE STATUS

    async updateLeaveStatus(leaveId, status) {
        try {
            const [leavesStatus] = await pool.query(sql.UPDATE_LEAVE_STATUS, [status, leaveId]);
            if(leavesStatus.affectedRows==1){
                const [emailResult] = await pool.query(sql.GET_EMAIL_BY_LEAVE_ID, [leaveId]);
                const email = emailResult[0].email;
                let sendEmail = utils.sendEmail(email, status);
                if(sendEmail){
                    return { message: "Email sent" };
                }
            }
        } catch (error) {
            console.error("Error updating leave status or sending email:", error);
            throw error;
        }
    },


    async getAllLeavesAppliedByUserId(userId) {
        try {
            const [allLeaves] = await pool.query(sql.GET_ALL_LEAVES_BY_USER_ID, [userId]);
            const leaves = []
            let leave_status;
            for (const allLeave of allLeaves) {
                const { leave_id, first_name, last_name, leave_category } = allLeave;
                const from_date = new Date(allLeave.from_date).toISOString().split('T')[0];
                const till_date = new Date(allLeave.till_date).toISOString().split('T')[0];
                if (allLeave.leave_status === 1) {
                    leave_status = 'pending'
                }
                else if (allLeave.leave_status === 2) {
                    leave_status = 'approved'
                }
                else if (allLeave.leave_status === 3) {
                    leave_status = 'rejected'
                }
                leaves.push({ leave_id, first_name, last_name, from_date, till_date, leave_category, leave_status });
            }
            return leaves;
        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },
}
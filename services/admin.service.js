const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const convertBase64 = require('../utils/utils');



module.exports = {

    // INSERT ATTENDENCE
    // async getAllManagerAttendance() {
    //     try {
    //         const modifiedAttendance = []
    //         const [attendances] = await pool.query(sql.GET_ALL_MANAGER_ATTENDANCE);
    //         if (attendances) {
    //             for (const attendance of attendances) {
    //                 const filename = convertBase64.extractFilenameFromURL(attendance.attendance_picture);
    //                 const base64 = convertBase64.convertFileIntoBase64(filename)
    //                 attendance.attendance_picture = base64
    //                 modifiedAttendance.push(attendance);
    //             }
    //             return modifiedAttendance
    //         }

    //     }
    //     catch (error) {
    //         console.error("Error creating user:", error);
    //         throw error;
    //     }
    // },
    async getAllManagerAttendance() {
        try {
            const modifiedAttendance = [];
            const [attendances] = await pool.query(sql.GET_ALL_MANAGER_ATTENDANCE);
    
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
                            attendance_id: attendance.attendance_id,
                            user_id: userId,
                            attendance_picture: attendance.attendance_picture,
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
    }
    

    // [
    //     {
    //         "attendance_id": 37,
    //         "user_id": 2,
    //         "attendance_picture": "/9j/4AAQSkZJRgABAQAAAQABAAD/FP4bNW7dxa3SdqkLEj4I9jXkbxb8Nr7QuZLFzbldhcbjbPIEgiDwfYj/KvTzGeSlzy1kgJMfjUjOYrDa4wzuFzTAcacHoWRKmz7it10vqEuNKpfpZyPqT02uqYbX614Z4iwzrT2DshxuQopKT8LIorhFJtM/lG1AAqbaUmOnejWt/CnMeGt4u0uUquMa68pdtcgcKRMgH2IqpWj3l6juXlOQCwghPvBiK7WE45Y90XpninI4ebh5HizRqSLNcs29w55izJisqKhbboKlLgzEAVlLbQvajq7182hKvs1skSOD80PXnXXFeU44sE9p9qysrk+VyMnIblkds986fxMHDgoYIqK/VlZWTD7aoxsk3RJtX3blZhRhImiFsy466kLUeeJntWVlJdSYE7iH7DG7trinCU/7M8Vb8Q0EpCGzAAEVlZSZG6LsTd0TbzGFR3trAPXpSLZy9s3CkuEg89ayspcfiy5/cqZOyePxeqcS7h82yHmHxt5HKTHBHsa8keKXh7feHuskWzz6Hre6YU5bODqUBXAI6giaysrqOh55uXa3o879d8PDLirkdv3p+QfYPPrtkqCUq+elZWVldcoRo8lb2f//Z",
    //         "attendance": [
    //             {
    //                 "date": "2024-01-31",
    //                 "ClockIn": [
    //                     {
    //                         "time": "20:14:14",
    //                         "location": "33.6277313,73.0759331",
    //                         "clock_type": "CI"
    //                     }
    //                 ],
    //                 "ClockOut": [
    //                     {
    //                         "time": "20:20:45",
    //                         "location": "33.6277313,73.0759331",
    //                         "clock_type": "CO"
    //                     }
    //                 ]
    //             }
    //         ],
    //         "time_zone": "EST",
    //         "first_name": "test",
    //         "last_name": "manager",
    //         "email": "test@manager.com",
    //         "password": "123456789",
    //         "user_type": 2,
    //         "designation": "Manager",
    //         "date_of_joining": null,
    //         "profile_picture": null
    //     }
    // ]

}
const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const convertBase64 = require('../utils/utils');



module.exports = {

    // GET ALL MANAGERS REGISTERED  
    async getAllManagers() {
        try {
            const managerMap = new Map();
            const [managers] = await pool.query(sql.GET_ALL_MANAGERS);

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
                        "date_of_joining": manager.date_of_joining
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

    // GET ALL MANAGERS ATTENDANCE
    async getAllManagerAttendance(y, m) {
        try {
            const modifiedAttendance = [];
            const year = y ? y : null
            const month = m ? m : null
            const [attendances] = await pool.query(sql.GET_ALL_MANAGER_ATTENDANCE, [year , year , month , month ]);

            if (attendances) {
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
    }



    // [
    //     {
    //         "attendance_id": 41,
    //         "user_id": 2,
    //         "attendance": [
    //             {
    //                 "date": "2024-02-01",
    //                 "ClockIn": [
    //                     {
    //                         "time": "19:43:44",
    //                         "location": "33.6494595,73.075933",
    //                         "clock_type": "CI",
    //                          "attendance_picture": "/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAi8aSw/eE9kxz6YYf1oDxL/AMFxlpkqgcriWME/LzoItSY70iZ28neQI5bcqOtZSdlCWt1YWXThbiJ7qOOG4BY+pqtu3zgayN/b8aWsX72blguPEBzEZ5W+eKysq/wClZZx5EaZzP1Vx8eTg5HJfF/3KE1JY4eK7IyM2J4pFH86zU4Y4NT0u4jPiS8QZxvvWVldzk+1pI8OnFWSbUraP4tsJkY6k1lZWUSZKkj//2Q=="
    //                     }
    //                 ],
    //                 "ClockOut": [
    //                     {
    //                         "time": "19:45:14",
    //                         "location": "33.6494595,73.075933",
    //                         "clock_type": "CO",
    //                          "attendance_picture": "/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAi8aSw/eE9kxz6YYf1oDxL/AMFxlpkqgcriWME/LzoItSY70iZ28neQI5bcqOtZSdlCWt1YWXThbiJ7qOOG4BY+pqtu3zgayN/b8aWsX72blguPEBzEZ5W+eKysq/wClZZx5EaZzP1Vx8eTg5HJfF/3KE1JY4eK7IyM2J4pFH86zU4Y4NT0u4jPiS8QZxvvWVldzk+1pI8OnFWSbUraP4tsJkY6k1lZWUSZKkj//2Q=="
    //                     }
    //                 ]
    //             },
    //             {
    //                 "date": "2024-02-02",
    //                 "ClockIn": [
    //                     {
    //                         "time": "20:29:22",
    //                         "location": "33.6494595,73.075933",
    //                         "clock_type": "CI",
    //                          "attendance_picture": "/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAi8aSw/eE9kxz6YYf1oDxL/AMFxlpkqgcriWME/LzoItSY70iZ28neQI5bcqOtZSdlCWt1YWXThbiJ7qOOG4BY+pqtu3zgayN/b8aWsX72blguPEBzEZ5W+eKysq/wClZZx5EaZzP1Vx8eTg5HJfF/3KE1JY4eK7IyM2J4pFH86zU4Y4NT0u4jPiS8QZxvvWVldzk+1pI8OnFWSbUraP4tsJkY6k1lZWUSZKkj//2Q=="
    //                     }
    //                 ],
    //                 "ClockOut": [
    //                     {
    //                         "time": "20:29:48",
    //                         "location": "33.6494595,73.075933",
    //                         "clock_type": "CO",
    //                         "attendance_picture": "/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAi8aSw/eE9kxz6YYf1oDxL/AMFxlpkqgcriWME/LzoItSY70iZ28neQI5bcqOtZSdlCWt1YWXThbiJ7qOOG4BY+pqtu3zgayN/b8aWsX72blguPEBzEZ5W+eKysq/wClZZx5EaZzP1Vx8eTg5HJfF/3KE1JY4eK7IyM2J4pFH86zU4Y4NT0u4jPiS8QZxvvWVldzk+1pI8OnFWSbUraP4tsJkY6k1lZWUSZKkj//2Q=="
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
    //     },
    // ]

}
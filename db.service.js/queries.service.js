module.exports = {

    CREATE_DATABASE: `CREATE DATABASE IF NOT EXISTS ems`,

    CREATE_TABLE_USERS: `CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        profile_picture VARCHAR(150),
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(100),
        password VARCHAR(255),
        role VARCHAR(10),
        designation VARCHAR(20),
        date_of_joining DATE
    );`,

    CREATE_TABLE_ATTENDANCE: `CREATE TABLE IF NOT EXISTS attendance (
        attendance_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        attendance_picture VARCHAR(150),
        location VARCHAR(50), 
        attendance_date_time TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );`,

    INSERT_INTO_USERS: `INSERT INTO users
    (profile_picture, first_name, last_name, email, password, role, designation, date_of_joining)
     VALUES (?,?,?,?,?,?,?,?)`,

    INSERT_INTO_ATTENDANCE: `INSERT INTO attendance
    (user_id, attendance_picture, location, attendance_date_time)
     VALUES (?,?,?,?)`,

    CHECK_USER_REGISTERED: `
    SELECT email, role 
    FROM users 
    WHERE email=? AND role=?`,

    LOGIN_USER: `
    SELECT * 
    FROM users 
    WHERE email=? AND password=?`,

}

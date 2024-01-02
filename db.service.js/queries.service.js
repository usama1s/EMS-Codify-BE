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

    CREATE_TABLE_MANAGER: `CREATE TABLE IF NOT EXISTS manager (
        manager_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        role VARCHAR(15),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
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
    (first_name, last_name, email, password, designation, date_of_joining, user_type)
     VALUES (?,?,?,?,?,?,?)`,
     
     INSERT_INTO_MANAGER: `INSERT INTO manager
    (user_id,role)
     VALUES (?,?)`,

    INSERT_INTO_ATTENDANCE: `INSERT INTO attendance
    (user_id, attendance_picture, location, attendance_date_time)
     VALUES (?,?,?,?)`,

    CHECK_USER_REGISTERED: `
    SELECT email, user_type 
    FROM users 
    WHERE email=? AND user_type=?`,

    LOGIN_USER: `
    SELECT * 
    FROM users 
    WHERE email=? AND password=? AND user_type=?`,

}

module.exports = {


    CREATE_DATABASE: `CREATE DATABASE IF NOT EXISTS ems`,


    CREATE_TABLE_USERS: `CREATE TABLE IF NOT EXISTS  users (
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


    INSERT_INTO_USERS: `INSERT INTO users
    (profile_picture, first_name, last_name, email, password, role, designation, date_of_joining)
     VALUES (?,?,?,?,?,?,?,?)`,


    CHECK_USER_REGISTERED: `
    SELECT email, role 
    FROM users 
    WHERE email=? AND role=?`,

}


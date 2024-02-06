module.exports = {

    CREATE_DATABASE: `CREATE DATABASE IF NOT EXISTS ems`,

    CREATE_TABLE_USERS: `CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        profile_picture VARCHAR(150),
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(100),
        password VARCHAR(255),
        user_type INT,
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
        attendance_date_time DATETIME,
        time_zone VARCHAR(50),
        clock_type VARCHAR(3),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );`,

    CREATE_TABLE_EMPLOYEE: `CREATE TABLE IF NOT EXISTS employee (
        employee_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        reporting_manager_from_users INT,
        contract_start_date Date,
        contract_end_date Date,
        pay INT,
        signed_contract_pdf VARCHAR(150),
        contract_status INT,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (reporting_manager_from_users) REFERENCES users(user_id)
    );`,

    CREATE_TABLE_EMPLOYEE_PROGESS: `CREATE TABLE IF NOT EXISTS employee_progress (
        employee_progress_id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT,
        progress_date DATE,
        FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
    );`,

    CREATE_TABLE_EMPLOYEE_PROGESS_DETAIL: `CREATE TABLE IF NOT EXISTS employee_progress_detail (
        employee_progress_detail_id INT AUTO_INCREMENT PRIMARY KEY,
        employee_progress_id INT,
        hours VARCHAR(15),
        title VARCHAR(50),
        description VARCHAR(250),
        FOREIGN KEY (employee_progress_id) REFERENCES employee_progress(employee_progress_id)
    );`,

    INSERT_INTO_USERS: `INSERT INTO users
    (first_name, last_name, email, password, user_type, designation, date_of_joining)
     VALUES (?,?,?,?,?,?,?)`,

    INSERT_INTO_MANAGER: `INSERT INTO manager
    (user_id,role)
     VALUES (?,?)`,

     INSERT_INTO_EMPLOYEE: `INSERT INTO employee
     (user_id)
     VALUES(?);`,

    INSERT_INTO_ATTENDANCE: `INSERT INTO attendance
    (user_id, attendance_picture, location, attendance_date_time, time_zone, clock_type)
     VALUES (?,?,?,?,?,?)`,

    CHECK_USER_REGISTERED: `
    SELECT email, user_type 
    FROM users 
    WHERE email=? AND user_type=?`,

    LOGIN_USER: `
    SELECT * 
    FROM users 
    WHERE email=? AND password=? AND user_type=?`,

    LOGIN_MANAGER: `
    select
	*
    from
	users
    inner join manager on
	manager.user_id = users.user_id
    where
	users.email = ?
	and users.password  = ?
	and users.user_type =?
    `,

    CHECK_MOST_RECENT_ATTENDANCE_TIME: `
    select
    attendance.time_zone,
	attendance.attendance_date_time
    from
	attendance
    inner join
    users on
	attendance.user_id = users.user_id
    where
	users.user_id = ? and attendance.clock_type = ? 
    order by
	attendance.attendance_date_time desc
    limit 1;
    `,

    GET_ALL_MANAGER_ATTENDANCE: `
    SELECT
    *
    FROM
    attendance
    INNER JOIN
    users ON attendance.user_id = users.user_id
    WHERE
    users.user_type = 2;
    `,

    GET_ALL_EMPLOYEE_ATTENDANCE: `
    SELECT
    *
    FROM
    attendance
    INNER JOIN
    users ON attendance.user_id = users.user_id
    WHERE
    users.user_type = 3;
    `,

    GET_ATTENDANCE_BY_USER_ID: `
   SELECT
    *
    FROM
    attendance
    INNER JOIN
    users ON attendance.user_id = users.user_id
    WHERE
    users.user_id=?
    `,

    GET_ALL_MANAGERS: `
    select
	*
    from
	users
    inner join manager on
	manager.user_id = users.user_id
    where
	users.user_type =?;
    `,

    GET_ALL_EMPLOYEE: `
    select
	*
    from
	users
    inner join employee on
	employee.user_id = users.user_id
    where
	users.user_type =?;
    `,
}

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

    CREATE_TABLE_EMPLOYEE_PROGESS_DETAIL: `CREATE TABLE IF NOT EXISTS employee_progress_detail (
        employee_progress_detail_id INT AUTO_INCREMENT PRIMARY KEY,
        start_time VARCHAR(15),
        title VARCHAR(50),
        description VARCHAR(250),
        end_time VARCHAR(15),
        attendance_id INT,
        FOREIGN KEY (attendance_id) REFERENCES attendance(attendance_id)
    );`,

    CREATE_TABLE_LEAVE: `CREATE TABLE IF NOT EXISTS leave_applied (
        leave_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        from_date DATE,
        till_date DATE,
        leave_category VARCHAR(30),
        leave_status INT DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
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
    SELECT *
    FROM attendance
    INNER JOIN users ON attendance.user_id = users.user_id
    WHERE 
    users.user_type = 2
    AND (
        (? IS NULL OR YEAR(attendance.attendance_date_time) = ?) 
        AND 
        (? IS NULL OR MONTH(attendance.attendance_date_time) = ?)
    )
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

    GET_ALL_EMPLOYEE_ATTENDANCE_AND_PROGRESS: `
    select
	*
    from
	attendance
    inner join
    users on
	attendance.user_id = users.user_id
    inner join employee on
	employee.user_id = users.user_id
    inner join employee_progress_detail on
	employee_progress_detail.attendance_id = attendance.attendance_id
    where
	users.user_type = 3
    AND (
        (? IS NULL OR YEAR(attendance.attendance_date_time) = ?) 
        AND 
        (? IS NULL OR MONTH(attendance.attendance_date_time) = ?)
    )
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
    AND (
        (? IS NULL OR YEAR(attendance.attendance_date_time) = ?) 
        AND 
        (? IS NULL OR MONTH(attendance.attendance_date_time) = ?)
    )
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

    GET_CLOCKIN_STATUS_BY_USERID_AND_DATE: `
    select
    clock_type
    from
    attendance
    where
    user_id =?
    and
    DATE(attendance_date_time) =?
    order by
	attendance_date_time desc
    limit 1;
    `,

    GET_EMPLOYEE_ID: `
    select
    employee_id 
    from 
    employee
    where user_id=?
    `,

    INSERT_INTO_EMPLOYEE_PROGRESS: `INSERT INTO employee_progress
    (employee_id, progress_date)
    VALUES(?, ?);`,

    INSERT_INTO_EMPLOYEE_PROGRESS_DETAILS: `INSERT INTO employee_progress_detail
    ( start_time, title, description, end_time, attendance_id)
    VALUES(?, ?, ?, ?, ?);`,

    GET_CLOCKIN_TIME_BY_USERID_AND_DATE: `
    select
    attendance_date_time
    from
    attendance
    where
    user_id =?
    and
    DATE(attendance_date_time) =?
    order by
	attendance_date_time desc
    limit 1;
    `,

    CHECK_PROGRESS: `
    select
	employee_progress_detail.start_time,
    employee_progress_detail.end_time,
    employee_progress_detail.title,
    employee_progress_detail.description
    from
	attendance
    inner join 
    employee_progress_detail on attendance.attendance_id =employee_progress_detail.attendance_id 
    where 	
    attendance.attendance_id =?
    and
    employee_progress_detail.start_time =? 
    and
    employee_progress_detail.end_time =? 
    and
    DATE(attendance.attendance_date_time) =?
    `,

    GET_EMPLOYEE_ATTENDANCE_ID: `
    select
	*
    from
	attendance
    where
	user_id = ?
    and
    DATE(attendance_date_time) =?
    `,

    GET_EMPLOYEE_PROGRESS_DETAIL: `
    SELECT
    attendance.attendance_id,
    attendance.attendance_date_time,
    employee_progress_detail.start_time,
    employee_progress_detail.end_time,
    employee_progress_detail.title,
    employee_progress_detail.description
    FROM
    attendance
    inner join employee_progress_detail on
	employee_progress_detail.attendance_id = attendance.attendance_id
    WHERE
    attendance.attendance_id =?
    and
    DATE(attendance.attendance_date_time) =?
    `,

    INSERT_INTO_LEAVE_APPLIED: `INSERT INTO leave_applied
    ( user_id, from_date, till_date, leave_category)
    VALUES( ?, ?, ?, ?);`,

    GET_ALL_PENDING_LEAVES: `
    SELECT
    leave_applied.leave_id,
    users.first_name,
    users.last_name,
    leave_applied.from_date,
    leave_applied.till_date,
    leave_applied.leave_category,
    leave_applied.leave_status
    FROM
    leave_applied
    inner join users on
	leave_applied.user_id = users.user_id
    WHERE
    leave_applied.leave_status= 1
    `,

    UPDATE_LEAVE_STATUS: `
    UPDATE leave_applied
    SET leave_status=?
    WHERE leave_id=?;
    `,
}

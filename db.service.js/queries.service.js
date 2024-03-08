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

    CREATE_TABLE_EMPLOYEE_CONTRACT: `CREATE TABLE IF NOT EXISTS employee_contract (
        employee_contract_id INT AUTO_INCREMENT PRIMARY KEY,
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

    CREATE_TABLE_ASSETS: `CREATE TABLE IF NOT EXISTS asset (
        asset_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        asset_title VARCHAR(30),
        asset_description VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );`,

    CREATE_TABLE_ASSETS_FILES: `CREATE TABLE IF NOT EXISTS asset_files (
        asset_files_id INT AUTO_INCREMENT PRIMARY KEY,
        asset_id INT,
        picture_1 VARCHAR(255),
        picture_2 VARCHAR(255),
        picture_3 VARCHAR(255),
        picture_4 VARCHAR(255),
        picture_5 VARCHAR(255),
        picture_6 VARCHAR(255),
        picture_7 VARCHAR(255),
        FOREIGN KEY (asset_id) REFERENCES asset(asset_id)
    );`,

    CREATE_TABLE_ALLOTED_ASSET: `CREATE TABLE IF NOT EXISTS alloted_asset (
        alloted_asset_id INT AUTO_INCREMENT PRIMARY KEY,
        asset_id INT,
        user_id INT,
        picture_1 VARCHAR(255),
        picture_2 VARCHAR(255),
        FOREIGN KEY (asset_id) REFERENCES asset(asset_id),  
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );`,

    CREATE_TABLE_SALARY_PAYMENTS: `CREATE TABLE IF NOT EXISTS salary_payment (
        salary_payment_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        month VARCHAR(25),  
        amount INT,
        bonus INT, 
        tax float, 
        total_paid VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );`,

    INSERT_INTO_USERS: `INSERT INTO users
    (first_name, last_name, email, password, user_type, designation, date_of_joining)
     VALUES (?,?,?,?,?,?,?)`,

    INSERT_INTO_MANAGER: `INSERT INTO manager
    (user_id,role)
     VALUES (?,?)`,

    INSERT_INTO_EMPLOYEE_CONTRACT: `INSERT INTO employee_contract
    (user_id, reporting_manager_from_users, contract_start_date, contract_end_date, pay, signed_contract_pdf)
    VALUES(?, ?, ?, ?, ?, ?);`,

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
    users.user_type = 2 or users.user_type = 23
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
	users.user_id,
	users.first_name,
	users.last_name,
	users.email,
	users.user_type,
    manager.role,
	users.designation,
    DATE_FORMAT(users.date_of_joining, '%Y-%m-%d') AS date_of_joining
    from
	users
    inner join manager on
	manager.user_id = users.user_id
    where
	users.user_type =2 or users.user_type =23;
    `,

    GET_ALL_EMPLOYEE: `
    select
	*
    from
	users
    where
	user_type =3 or user_type =23 ;
    `,

    GET_ALL_USERS: `
    select
	user_id,
    first_name,
    last_name
    from
	users
    where
	users.user_type =? or users.user_type =?;
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

    GET_ALL_LEAVES: `
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
    `,

    UPDATE_LEAVE_STATUS: `
    UPDATE leave_applied
    SET leave_status=?
    WHERE leave_id=?;
    `,

    GET_ALL_LEAVES_BY_USER_ID: `
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
    where 
    leave_applied.user_id=?
    `,

    GET_EMAIL_BY_LEAVE_ID: `
    select users.email  from leave_applied
	inner join users on leave_applied.user_id =users.user_id  
	where leave_applied.leave_id  =?
    `,

    INSERT_INTO_ASSETS: `INSERT INTO asset
    (user_id, asset_title, asset_description,asset_company, adding_date)
    VALUES(?, ?, ?, ?, ?);`,

    INSERT_INTO_ASSET_FILES: `INSERT INTO asset_files
    (asset_id, picture_1, picture_2, picture_3, picture_4, picture_5, picture_6, picture_7)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?);`,

    GET_ALL_ASSETS: `
    select
	asset.asset_id,
	asset.asset_title,
	asset.asset_description,
	asset.asset_company,
	asset_files.picture_1,
	asset_files.picture_2,
	asset_files.picture_3,
	asset_files.picture_4,
	asset_files.picture_5,
	asset_files.picture_6,
	asset_files.picture_7
    from
	asset
    inner join asset_files on
	asset.asset_id = asset_files.asset_id
    `,

    INSERT_INTO_ALLOT_ASSET: `INSERT INTO alloted_asset
    ( asset_id, user_id, picture_1, picture_2,project_title, project_description,allotment_date)
    VALUES(?, ?, ?, ?, ?, ?,?);`,

    GET_ALLOTED_ASSET_BY_ASSET_ID: `SELECT asset_id FROM alloted_asset where asset_id=?;`,

    GET_ALL_ALLOTED_ASSET: `
    select
	*
    from
	alloted_asset
    left join users on
	users.user_id = alloted_asset.user_id
    inner join asset on
	asset.asset_id = alloted_asset.asset_id
    inner join asset_files on
	asset.asset_id = asset_files.asset_id ; ;
	`,

    CREATE_EMPLOYEE_CONTRACT: `
    UPDATE ems.employee
    SET reporting_manager_from_users=?, contract_start_date=?, contract_end_date=?, pay=?, signed_contract_pdf=?
    WHERE employee_id=0;
	`,

    GET_USER_DATA_BY_USER_ID: `
    SELECT *
    FROM users
    WHERE user_id=?`,

    GET_ALL_USER_FOR_CONTRACT: `
    select
    *
    from
    users
    where
    user_type =2 or user_type =3;
    `,

    GET_USER_WITH_CONTRACTS: `
    SELECT *
    FROM employee_contract 
    where user_id=? and contract_status=1 ;`,

    GET_USER_CONTRACTS_BY_USER_ID: `
    SELECT 
    employee_contract_id, 
    user_id, 
    reporting_manager_from_users, 
    DATE_FORMAT(contract_start_date, '%Y-%m-%d') AS contract_start_date, 
    DATE_FORMAT(contract_end_date, '%Y-%m-%d') AS contract_end_date, 
    pay, 
    signed_contract_pdf, 
    contract_status 
    FROM 
    employee_contract 
    WHERE 
    user_id = ?;
`,

    CHANGE_CONTRACT_STATUS: `
    UPDATE employee_contract
    SET contract_status=?
    WHERE employee_contract_id=?;`,

    GET_ALL_ACTIVE_CONTRACTS: `
    SELECT 
    employee_contract_id, 
    user_id, 
    reporting_manager_from_users, 
    DATE_FORMAT(contract_start_date, '%Y-%m-%d') AS contract_start_date, 
    DATE_FORMAT(contract_end_date, '%Y-%m-%d') AS contract_end_date, 
    pay, 
    signed_contract_pdf, 
    contract_status 
    FROM 
    employee_contract 
    WHERE 
    contract_status= 1;
    `,

    INSERT_INTO_SALARY_PAYMENT: `
    INSERT INTO salary_payment
    (user_id, month, amount, bonus, tax, total_paid,salary_attactment,year)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?);
    `,

    GET_ALL_SALARY_PAID: `
    SELECT salary_payment_id, user_id, month, amount, bonus, tax, total_paid, salary_attactment,year
    FROM salary_payment
    where user_id=? and month=? and year=?;
    `,


}

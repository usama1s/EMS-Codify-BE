const mysql = require("mysql2/promise");
const sql = require("./queries.service");

// Database creation and table creation module

async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
        });

        // Create the database if it does not exist
        await connection.query(sql.CREATE_DATABASE);
        console.log("Database created or already exists");

        // Switch to the newly created or existing database
        await connection.query("USE ems");

        // Create the table if it does not exist
        await connection.query(sql.CREATE_TABLE_USERS);
        console.log("Tables created or already exist");

        await connection.end();
    } catch (error) {
        console.error("Error creating database or table:", error.message);
    }
}

// Connection pool module
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "ems",
});

// Export both modules
module.exports = { createDatabase, pool };

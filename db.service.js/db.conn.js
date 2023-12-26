const mysql = require("mysql2/promise");
const sql = require("./queries.service")
// Create a connection pool
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "ems",
});

module.exports = {
    async createDatabase() {
        try {
            const connection = await mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
            });

            // Create the database if it does not exist
            await connection.query(sql.CREATE_DB);

            console.log("Database created or already exists");
            await connection.end();
        } catch (error) {
            console.error("Error creating database:", error.message);
        }
    }

}
// Function to create the database if it does not exist

// // Function to connect to the database
// export async function connectToDatabase() {
//     try {
//         // Create the database if it does not exist
//         await createDatabase();

//         // Use the connection pool to get a connection
//         const connection = await pool.getConnection();

//         console.log("Connected to the database");
//         connection.release();
//     } catch (error) {
//         console.error("Error connecting to the database:", error.message);
//     }
// }

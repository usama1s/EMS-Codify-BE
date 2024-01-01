const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
// const { generateToken } = require("../util/admin.jwt");

module.exports = {

    // TO RESGISTER USERS
    async register(userDetail, profileFilePath) {
        try {
            const { email, password, role, designation, first_name, last_name, date_of_joining } = userDetail;

            const [isUserRegistered] = await pool.query(sql.CHECK_USER_REGISTERED, [
                email,
                role,
            ]);
            if (!isUserRegistered.length) {
                await pool.query(sql.INSERT_INTO_USERS, [
                    profileFilePath,
                    first_name,
                    last_name,
                    email,
                    password,
                    role,
                    designation,
                    date_of_joining
                ]);
                return { message: "User Created Successfully" }
            } else {
                return { message: "User Not Created " }
            }
        }


        catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    //get user by id
    async getUserById(userId) {
        try {
            const [user] = await pool.query(sql.GET_USER_BY_ID, [userId]);

            if (user.length === 1) {
                const { role } = user[0];

                switch (role) {
                    case 1: // Admin
                        return async () => {
                            try {
                                const [adminDetails] = await pool.query(sql.GET_ADMIN_DETAILS, [
                                    userId,
                                ]);
                                return { user: adminDetails[0], roleDetails: adminDetails[0] };
                            } catch (error) {
                                throw error;
                            }
                        };
                    case 2: // Instructor
                        return async () => {
                            try {
                                const [instructorDetails] = await pool.query(
                                    sql.GET_INSTRUCTOR_DETAILS,
                                    [userId]
                                );
                                return {
                                    user: instructorDetails[0],
                                    roleDetails: instructorDetails[0],
                                };
                            } catch (error) {
                                throw error;
                            }
                        };
                    case 3: // Student
                        return async () => {
                            try {
                                const [studentDetails] = await pool.query(
                                    sql.GET_STUDENT_DETAILS,
                                    [userId]
                                );
                                return {
                                    user: studentDetails[0],
                                    roleDetails: studentDetails[0],
                                };
                            } catch (error) {
                                throw error;
                            }
                        };
                    default:
                        return null; // Unknown role
                }
            } else {
                return null; // User not found
            }
        } catch (error) {
            throw error;
        }
    },

    //Edit user by id
    async editUserById(userId, updatedUserData) {
        try {
            const { role, admin_type } = updatedUserData;

            switch (role) {
                case 1: // Admin
                    async () => {
                        try {
                            await pool.query(sql.UPDATE_ADMIN_TYPE, [admin_type, userId]);
                            await pool.query(sql.EDIT_ADMIN_DETAILS, [
                                updatedUserData,
                                userId,
                            ]);
                        } catch (error) {
                            throw error;
                        }
                    };
                    break;
                case 2: // Instructor
                    async () => {
                        try {
                            await pool.query(sql.EDIT_INSTRUCTOR_DETAILS, [
                                updatedUserData,
                                userId,
                            ]);
                        } catch (error) {
                            throw error;
                        }
                    };
                    break;
                case 3: // Student
                    async () => {
                        try {
                            await pool.query(sql.EDIT_STUDENT_DETAILS, [
                                updatedUserData,
                                userId,
                            ]);
                        } catch (error) {
                            throw error;
                        }
                    };
                    break;
                default:
                    return "Unknown role";
            }

            return "User details updated successfully";
        } catch (error) {
            throw error;
        }
    },

    // SIGN IN
    async signIn(email, password) {
        try {

            const [results] = await pool.query(sql.LOGIN_USER, [
                email,
                password
            ]);

            return results[0]
        } catch (error) {
            console.error("Error signing in:", error);
            throw error;
        }
    },
};
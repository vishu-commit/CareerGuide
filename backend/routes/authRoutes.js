const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../middleware/authMiddleware");


// =====================================================
// REGISTER
// =====================================================

router.post("/register", (req, res) => {

    const {
        name,
        email,
        password,
        role,
        specialization,
        experience,
        consultation_fee,
        bio
    } = req.body;


    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!name || !email || !password) {

        return res.status(400).json({
            message: "Name, email and password are required"
        });

    }


    // =================================================
    // VALID ROLE
    // =================================================

    const userRole =
        role === "counsellor"
            ? "counsellor"
            : "student";


    // =================================================
    // CHECK EMAIL ALREADY EXISTS
    // =================================================

    const checkSql =
        "SELECT id FROM users WHERE email = ?";


    db.query(
        checkSql,
        [email],
        (checkError, existingUser) => {

            if (checkError) {

                console.log(
                    "Email Check Error:",
                    checkError
                );

                return res.status(500).json({
                    message: "Registration failed"
                });

            }


            if (existingUser.length > 0) {

                return res.status(409).json({
                    message:
                        "An account with this email already exists"
                });

            }


            // =================================================
            // INSERT USER
            // =================================================

            const insertUserSql = `
                INSERT INTO users
                (name, email, password, role)
                VALUES (?, ?, ?, ?)
            `;


            db.query(
                insertUserSql,
                [
                    name.trim(),
                    email.trim(),
                    password,
                    userRole
                ],
                (userError, userResult) => {

                    if (userError) {

                        console.log(
                            "User Registration Error:",
                            userError
                        );

                        return res.status(500).json({
                            message:
                                "User registration failed"
                        });

                    }


                    const userId =
                        userResult.insertId;


                    // =================================================
                    // STUDENT REGISTRATION
                    // =================================================

                    if (userRole === "student") {

                        return res.status(201).json({

                            message:
                                "Student account created successfully",

                            userId: userId,

                            role: "student"

                        });

                    }


                    // =================================================
                    // COUNSELLOR REGISTRATION
                    // =================================================

                    const counsellorSql = `
                        INSERT INTO counsellors
                        (
                            user_id,
                            specialization,
                            experience,
                            consultation_fee,
                            bio,
                            verification_status
                        )
                        VALUES (?, ?, ?, ?, ?, 'pending')
                    `;


                    db.query(
                        counsellorSql,
                        [
                            userId,

                            specialization ||
                                "Career Guidance",

                            experience !== undefined &&
                            experience !== ""
                                ? Number(experience)
                                : 0,

                            consultation_fee !== undefined &&
                            consultation_fee !== ""
                                ? Number(consultation_fee)
                                : 500,

                            bio || null
                        ],
                        (counsellorError) => {

                            if (counsellorError) {

                                console.log(
                                    "Counsellor Profile Error:",
                                    counsellorError
                                );


                                // =====================================
                                // ROLLBACK USER IF COUNSELLOR PROFILE
                                // FAILS
                                // =====================================

                                db.query(
                                    "DELETE FROM users WHERE id = ?",
                                    [userId],
                                    (deleteError) => {

                                        if (deleteError) {

                                            console.log(
                                                "Rollback Error:",
                                                deleteError
                                            );

                                        }

                                    }
                                );


                                return res.status(500).json({
                                    message:
                                        "Counsellor registration failed"
                                });

                            }


                            // =====================================
                            // SUCCESS
                            // =====================================

                            return res.status(201).json({

                                message:
                                    "Counsellor account created successfully. Your account is pending admin approval.",

                                userId: userId,

                                role: "counsellor",

                                verification_status:
                                    "pending"

                            });

                        }
                    );

                }
            );

        }
    );

});


// =====================================================
// LOGIN
// =====================================================

router.post("/login", (req, res) => {

    const {
        email,
        password
    } = req.body;


    if (!email || !password) {

        return res.status(400).json({
            message:
                "Email and password are required"
        });

    }


    const sql = `
        SELECT
            id,
            name,
            email,
            role,
            created_at
        FROM users
        WHERE email = ?
        AND password = ?
    `;


    db.query(
        sql,
        [email, password],
        (err, result) => {

            if (err) {

                console.log(
                    "Login Error:",
                    err
                );

                return res.status(500).json({
                    message: "Login failed"
                });

            }


            if (result.length === 0) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });

            }


            const user = result[0];


            // =================================================
            // JWT TOKEN
            // =================================================

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },

                "careerGuideSecret",

                {
                    expiresIn: "1h"
                }
            );


            // =================================================
            // COUNSELLOR VERIFICATION STATUS
            // =================================================

            if (user.role === "counsellor") {

                const counsellorSql = `
                    SELECT
                        id,
                        specialization,
                        experience,
                        consultation_fee,
                        bio,
                        verification_status
                    FROM counsellors
                    WHERE user_id = ?
                `;


                db.query(
                    counsellorSql,
                    [user.id],
                    (counsellorError, counsellorResult) => {

                        if (counsellorError) {

                            console.log(
                                "Counsellor Login Error:",
                                counsellorError
                            );

                            return res.status(500).json({
                                message:
                                    "Login failed"
                            });

                        }


                        const counsellor =
                            counsellorResult.length > 0
                                ? counsellorResult[0]
                                : null;


                        return res.json({

                            message:
                                "Login successful",

                            token: token,

                            user: {
                                ...user,
                                counsellor:
                                    counsellor
                            }

                        });

                    }
                );


                return;

            }


            // =================================================
            // STUDENT / ADMIN LOGIN
            // =================================================

            res.json({

                message:
                    "Login successful",

                token: token,

                user: user

            });

        }
    );

});


// =====================================================
// PROTECTED PROFILE ROUTE
// =====================================================

router.get(
    "/profile",
    authMiddleware,
    (req, res) => {

        res.json({

            message:
                "Profile accessed successfully",

            user: req.user

        });

    }
);


// =====================================================
// STUDENT ONLY ROUTE
// =====================================================

router.get(
    "/student-dashboard",
    authMiddleware,
    (req, res) => {

        if (req.user.role !== "student") {

            return res.status(403).json({

                message:
                    "Access denied. Students only."

            });

        }


        res.json({

            message:
                "Welcome to Student Dashboard",

            user: req.user

        });

    }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;
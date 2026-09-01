const express = require("express");
const router = express.Router();

const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// ========================================
// COUNSELLOR ONLY MIDDLEWARE
// ========================================

const counsellorOnly = (req, res, next) => {

    if (req.user.role !== "counsellor") {

        return res.status(403).json({
            message: "Access denied. Counsellors only."
        });

    }

    next();
};


// ========================================
// GET ALL COUNSELLORS
// STUDENTS CAN USE THIS
// APPROVED + PENDING BOTH VISIBLE
// ========================================

router.get("/", authMiddleware, (req, res) => {

    const sql = `
        SELECT
            counsellors.id,
            counsellors.user_id,
            counsellors.specialization,
            counsellors.experience,
            counsellors.bio,
            counsellors.consultation_fee,
            counsellors.verification_status,

            users.name,
            users.email

        FROM counsellors

        JOIN users
            ON counsellors.user_id = users.id

        ORDER BY counsellors.id DESC
    `;


    db.query(sql, (err, result) => {

        if (err) {

            console.log(
                "Counsellor Fetch Error:",
                err
            );

            return res.status(500).json({
                message: "Failed to fetch counsellors"
            });

        }


        console.log(
            "COUNSELLORS API DATA:",
            result
        );


        return res.json({

            message:
                "Counsellors fetched successfully",

            counsellors:
                result

        });

    });

});


// ========================================
// GET SINGLE COUNSELLOR
// APPROVED + PENDING BOTH ACCESSIBLE
// ========================================

router.get("/:id", authMiddleware, (req, res) => {

    const counsellorId = req.params.id;


    const sql = `
        SELECT
            counsellors.id,
            counsellors.user_id,
            counsellors.specialization,
            counsellors.experience,
            counsellors.bio,
            counsellors.consultation_fee,
            counsellors.verification_status,

            users.name,
            users.email

        FROM counsellors

        JOIN users
            ON counsellors.user_id = users.id

        WHERE counsellors.id = ?
    `;


    db.query(
        sql,
        [counsellorId],
        (err, result) => {

            if (err) {

                console.log(
                    "Counsellor Error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to fetch counsellor"
                });

            }


            if (result.length === 0) {

                return res.status(404).json({
                    message:
                        "Counsellor not found"
                });

            }


            console.log(
                "SINGLE COUNSELLOR DATA:",
                result[0]
            );


            return res.json({

                message:
                    "Counsellor fetched successfully",

                counsellor:
                    result[0]

            });

        }
    );

});


// ========================================
// CREATE COUNSELLOR PROFILE
// COUNSELLOR ONLY
// ========================================

router.post(
    "/",
    authMiddleware,
    counsellorOnly,
    (req, res) => {

        const {
            specialization,
            experience,
            bio
        } = req.body;

        const userId = req.user.id;


        if (
            !specialization ||
            !experience ||
            !bio
        ) {

            return res.status(400).json({
                message:
                    "Specialization, experience and bio are required"
            });

        }


        const sql = `
            INSERT INTO counsellors
            (
                user_id,
                specialization,
                experience,
                bio
            )
            VALUES (?, ?, ?, ?)
        `;


        db.query(
            sql,
            [
                userId,
                specialization,
                experience,
                bio
            ],
            (err, result) => {

                if (err) {

                    console.log(
                        "Counsellor Profile Error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Counsellor profile creation failed"
                    });

                }


                return res.status(201).json({

                    message:
                        "Counsellor profile created successfully",

                    counsellorId:
                        result.insertId

                });

            }
        );

    }
);


// ========================================
// GET COUNSELLOR AVAILABLE SLOTS
// ========================================

router.get(
    "/:id/availability",
    authMiddleware,
    (req, res) => {

        const counsellorId =
            req.params.id;


        const sql = `
            SELECT
                id,
                available_date,
                start_time,
                end_time

            FROM counsellor_availability

            WHERE counsellor_id = ?

            AND available_date >= CURDATE()

            ORDER BY
                available_date,
                start_time
        `;


        db.query(
            sql,
            [counsellorId],
            (err, result) => {

                if (err) {

                    console.log(
                        "Availability Error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to fetch availability"
                    });

                }


                return res.json({

                    availability:
                        result

                });

            }
        );

    }
);


module.exports = router;
const express = require("express");
const router = express.Router();

const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// COUNSELLOR ONLY
// =====================================================

const counsellorOnly = (req, res, next) => {

    if (req.user.role !== "counsellor") {
        return res.status(403).json({
            message: "Counsellor access only"
        });
    }

    next();
};


// =====================================================
// ADD AVAILABILITY
// =====================================================

router.post(
    "/",
    authMiddleware,
    counsellorOnly,
    (req, res) => {

        const {
            available_date,
            start_time,
            end_time
        } = req.body;


        // =============================================
        // VALIDATION
        // =============================================

        if (!available_date || !start_time || !end_time) {

            return res.status(400).json({
                message: "All fields are required"
            });
        }


        if (start_time === end_time) {

            return res.status(400).json({
                message: "Start time and end time cannot be same"
            });
        }


        // =============================================
        // FIND COUNSELLOR
        // =============================================

        const sql = `
            SELECT id
            FROM counsellors
            WHERE user_id = ?
        `;

        db.query(
            sql,
            [req.user.id],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message: "Database error"
                    });
                }


                if (result.length === 0) {

                    return res.status(404).json({
                        message:
                            "Counsellor profile not found"
                    });
                }


                const counsellorId = result[0].id;


                // =============================================
                // CHECK OVERLAPPING AVAILABILITY
                // =============================================

                const checkOverlapSql = `
                    SELECT id
                    FROM counsellor_availability
                    WHERE counsellor_id = ?
                    AND available_date = ?

                    AND
                    (
                        (
                            TIME_TO_SEC(start_time) / 60
                        )
                        <
                        (
                            CASE
                                WHEN ? = '00:00:00'
                                THEN 1440
                                ELSE TIME_TO_SEC(?) / 60
                            END
                        )

                        AND

                        (
                            CASE
                                WHEN end_time = '00:00:00'
                                THEN 1440
                                ELSE TIME_TO_SEC(end_time) / 60
                            END
                        )
                        >
                        (
                            TIME_TO_SEC(?) / 60
                        )
                    )

                    LIMIT 1
                `;


                db.query(
                    checkOverlapSql,
                    [
                        counsellorId,
                        available_date,
                        end_time,
                        end_time,
                        start_time
                    ],
                    (err, overlapResult) => {

                        if (err) {
                            console.log(err);

                            return res.status(500).json({
                                message:
                                    "Failed to check availability"
                            });
                        }


                        // =============================================
                        // OVERLAPPING SLOT FOUND
                        // =============================================

                        if (overlapResult.length > 0) {

                            return res.status(400).json({
                                message:
                                    "This availability overlaps with an existing availability"
                            });
                        }


                        // =============================================
                        // INSERT AVAILABILITY
                        // =============================================

                        const insertSql = `
                            INSERT INTO counsellor_availability
                            (
                                counsellor_id,
                                available_date,
                                start_time,
                                end_time
                            )
                            VALUES (?, ?, ?, ?)
                        `;


                        db.query(
                            insertSql,
                            [
                                counsellorId,
                                available_date,
                                start_time,
                                end_time
                            ],
                            (err) => {

                                if (err) {
                                    console.log(err);

                                    return res.status(500).json({
                                        message:
                                            "Failed to add availability"
                                    });
                                }


                                return res.status(201).json({
                                    message:
                                        "Availability added successfully"
                                });

                            }
                        );

                    }
                );

            }
        );

    }
);


// =====================================================
// GET MY AVAILABILITY
// =====================================================

router.get(
    "/my",
    authMiddleware,
    counsellorOnly,
    (req, res) => {

        const sql = `
            SELECT
                ca.id,
                ca.available_date,
                ca.start_time,
                ca.end_time
            FROM counsellor_availability ca

            JOIN counsellors c
                ON ca.counsellor_id = c.id

            WHERE c.user_id = ?

            ORDER BY
                ca.available_date,
                ca.start_time
        `;


        db.query(
            sql,
            [req.user.id],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message:
                            "Failed to fetch availability"
                    });
                }


                res.json({
                    availability: result
                });

            }
        );

    }
);


// =====================================================
// DELETE AVAILABILITY
// =====================================================

router.delete(
    "/:id",
    authMiddleware,
    counsellorOnly,
    (req, res) => {

        const sql = `
            DELETE ca
            FROM counsellor_availability ca

            JOIN counsellors c
                ON ca.counsellor_id = c.id

            WHERE ca.id = ?
            AND c.user_id = ?
        `;


        db.query(
            sql,
            [
                req.params.id,
                req.user.id
            ],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message:
                            "Failed to delete availability"
                    });
                }


                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message:
                            "Availability not found"
                    });
                }


                res.json({
                    message:
                        "Availability deleted successfully"
                });

            }
        );

    }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// BOOK APPOINTMENT
// =====================================================

router.post("/", authMiddleware, (req, res) => {

    const studentId = req.user.id;

    const {
        counsellor_id,
        appointment_date,
        appointment_time
    } = req.body;

    console.log("============================================");
    console.log("BOOKING DATA RECEIVED");
    console.log("Student ID:", studentId);
    console.log("Counsellor ID:", counsellor_id);
    console.log("Appointment Date:", appointment_date);
    console.log("Appointment Time:", appointment_time);
    console.log("============================================");

    if (!counsellor_id || !appointment_date || !appointment_time) {
        return res.status(400).json({
            message: "Counsellor, date and time are required"
        });
    }

    // =====================================================
    // CHECK COUNSELLOR
    // =====================================================

    const checkCounsellor = `
        SELECT
            id,
            consultation_fee
        FROM counsellors
        WHERE id = ?
    `;

    db.query(
        checkCounsellor,
        [counsellor_id],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Counsellor not found"
                });
            }

            // =====================================================
            // CHECK AVAILABILITY
            // =====================================================

            const checkAvailability = `
                SELECT
                    id,
                    counsellor_id,
                    available_date,
                    start_time,
                    end_time
                FROM counsellor_availability
                WHERE counsellor_id = ?
                AND DATE(available_date) = ?
                AND TIME(start_time) = ?
            `;

            db.query(
                checkAvailability,
                [
                    counsellor_id,
                    appointment_date,
                    appointment_time
                ],
                (err, availabilityResult) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            message: "Failed to check availability"
                        });
                    }

                    if (availabilityResult.length === 0) {
                        return res.status(400).json({
                            message:
                                "Counsellor is not available at this date and time"
                        });
                    }

                    // =====================================================
                    // CHECK ALREADY BOOKED
                    // =====================================================

                    const checkAppointment = `
                        SELECT id
                        FROM appointments
                        WHERE counsellor_id = ?
                        AND DATE(appointment_date) = ?
                        AND TIME(appointment_time) = ?
                        AND status != 'rejected'
                    `;

                    db.query(
                        checkAppointment,
                        [
                            counsellor_id,
                            appointment_date,
                            appointment_time
                        ],
                        (err, appointmentResult) => {

                            if (err) {
                                console.log(err);

                                return res.status(500).json({
                                    message:
                                        "Failed to check appointment"
                                });
                            }

                            if (appointmentResult.length > 0) {
                                return res.status(400).json({
                                    message:
                                        "This time slot is already booked"
                                });
                            }

                            // =====================================================
                            // CREATE APPOINTMENT
                            // =====================================================

                            const sql = `
                                INSERT INTO appointments
                                (
                                    student_id,
                                    counsellor_id,
                                    appointment_date,
                                    appointment_time,
                                    status,
                                    meeting_link
                                )
                                VALUES (?, ?, ?, ?, 'pending', NULL)
                            `;

                            db.query(
                                sql,
                                [
                                    studentId,
                                    counsellor_id,
                                    appointment_date,
                                    appointment_time
                                ],
                                (err, result) => {

                                    if (err) {
                                        console.log(err);

                                        return res.status(500).json({
                                            message:
                                                "Failed to book appointment"
                                        });
                                    }

                                    console.log(
                                        "APPOINTMENT CREATED:",
                                        result.insertId
                                    );

                                    return res.status(201).json({
                                        message:
                                            "Appointment booked successfully",

                                        appointmentId:
                                            result.insertId
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});


// =====================================================
// STUDENT APPOINTMENTS
// =====================================================

router.get("/student", authMiddleware, (req, res) => {

    const studentId = req.user.id;

    const sql = `
        SELECT
            appointments.id,
            appointments.counsellor_id,
            appointments.appointment_date,
            appointments.appointment_time,
            appointments.status,
            appointments.meeting_link,

            users.name AS counsellor_name,
            users.email AS counsellor_email,

            counsellors.specialization,
            counsellors.experience,
            counsellors.consultation_fee

        FROM appointments

        JOIN counsellors
        ON appointments.counsellor_id = counsellors.id

        JOIN users
        ON counsellors.user_id = users.id

        WHERE appointments.student_id = ?

        ORDER BY appointments.id DESC
    `;

    db.query(
        sql,
        [studentId],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message:
                        "Failed to fetch student appointments"
                });
            }

            return res.json({
                message:
                    "Student appointments fetched successfully",

                appointments:
                    result
            });
        }
    );
});


// =====================================================
// COUNSELLOR APPOINTMENTS
// =====================================================

router.get("/counsellor", authMiddleware, (req, res) => {

    const counsellorUserId = req.user.id;

    const sql = `
        SELECT
            appointments.id,
            appointments.student_id,
            appointments.counsellor_id,
            appointments.appointment_date,
            appointments.appointment_time,
            appointments.status,
            appointments.meeting_link,

            students.name AS student_name,
            students.email AS student_email

        FROM appointments

        JOIN counsellors
        ON appointments.counsellor_id = counsellors.id

        JOIN users AS students
        ON appointments.student_id = students.id

        WHERE counsellors.user_id = ?

        ORDER BY appointments.id DESC
    `;

    db.query(
        sql,
        [counsellorUserId],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message:
                        "Failed to fetch appointments"
                });
            }

            return res.json({
                message:
                    "Counsellor appointments fetched successfully",

                appointments:
                    result
            });
        }
    );
});


// =====================================================
// UPDATE APPOINTMENT STATUS
// =====================================================

router.put("/:id/status", authMiddleware, (req, res) => {

    const appointmentId = req.params.id;

    const { status } = req.body;

    const counsellorUserId = req.user.id;

    // =====================================================
    // ALLOWED STATUSES
    // =====================================================

    const allowedStatuses = [
        "approved",
        "rejected",
        "completed"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid appointment status"
        });
    }

    // =====================================================
    // CHECK APPOINTMENT + COUNSELLOR OWNERSHIP
    // =====================================================

    const checkAppointment = `
        SELECT
            appointments.id,
            appointments.status,
            counsellors.user_id AS counsellor_user_id

        FROM appointments

        JOIN counsellors
        ON appointments.counsellor_id = counsellors.id

        WHERE appointments.id = ?
    `;

    db.query(
        checkAppointment,
        [appointmentId],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message:
                        "Failed to check appointment"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message:
                        "Appointment not found"
                });
            }

            const appointment = result[0];

            // =====================================================
            // CHECK COUNSELLOR OWNERSHIP
            // =====================================================

            if (
                Number(
                    appointment.counsellor_user_id
                ) !== Number(counsellorUserId)
            ) {
                return res.status(403).json({
                    message:
                        "You are not authorized to update this appointment"
                });
            }

            // =====================================================
            // UPDATE STATUS
            // =====================================================

            const updateAppointment = `
                UPDATE appointments
                SET status = ?
                WHERE id = ?
            `;

            db.query(
                updateAppointment,
                [
                    status,
                    appointmentId
                ],
                (err, updateResult) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            message:
                                "Failed to update appointment"
                        });
                    }

                    if (
                        updateResult.affectedRows === 0
                    ) {
                        return res.status(404).json({
                            message:
                                "Appointment not found"
                        });
                    }

                    console.log(
                        `Appointment #${appointmentId} updated to ${status}`
                    );

                    return res.json({
                        message:
                            `Appointment ${status} successfully`
                    });
                }
            );
        }
    );
});


// =====================================================
// ADD / UPDATE MEETING LINK
// =====================================================

router.put("/:id/meeting-link", authMiddleware, (req, res) => {

    const appointmentId = req.params.id;

    const { meeting_link } = req.body;

    const counsellorUserId = req.user.id;

    // =====================================================
    // CHECK MEETING LINK
    // =====================================================

    if (!meeting_link || meeting_link.trim() === "") {

        return res.status(400).json({
            message: "Meeting link is required"
        });

    }

    // =====================================================
    // CHECK APPOINTMENT + OWNERSHIP
    // =====================================================

    const checkAppointment = `
        SELECT
            appointments.id,
            appointments.status,
            counsellors.user_id AS counsellor_user_id

        FROM appointments

        JOIN counsellors
        ON appointments.counsellor_id = counsellors.id

        WHERE appointments.id = ?
    `;

    db.query(
        checkAppointment,
        [appointmentId],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message:
                        "Failed to check appointment"
                });

            }

            // =====================================================
            // APPOINTMENT NOT FOUND
            // =====================================================

            if (result.length === 0) {

                return res.status(404).json({
                    message:
                        "Appointment not found"
                });

            }

            const appointment = result[0];

            // =====================================================
            // CHECK COUNSELLOR OWNERSHIP
            // =====================================================

            if (
                Number(
                    appointment.counsellor_user_id
                ) !== Number(counsellorUserId)
            ) {

                return res.status(403).json({
                    message:
                        "You are not authorized to update this appointment"
                });

            }

            // =====================================================
            // UPDATE MEETING LINK
            // =====================================================

            const updateMeetingLink = `
                UPDATE appointments
                SET meeting_link = ?
                WHERE id = ?
            `;

            db.query(
                updateMeetingLink,
                [
                    meeting_link.trim(),
                    appointmentId
                ],
                (err, updateResult) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            message:
                                "Failed to save meeting link"
                        });

                    }

                    if (
                        updateResult.affectedRows === 0
                    ) {

                        return res.status(404).json({
                            message:
                                "Appointment not found"
                        });

                    }

                    console.log(
                        `Meeting link added for appointment #${appointmentId}`
                    );

                    return res.json({

                        message:
                            "Meeting link added successfully",

                        meeting_link:
                            meeting_link.trim()

                    });

                }
            );

        }
    );

});


// =====================================================
// DELETE MEETING LINK
// =====================================================

router.delete("/:id/meeting-link", authMiddleware, (req, res) => {

    const appointmentId = req.params.id;

    const counsellorUserId = req.user.id;

    // =====================================================
    // CHECK OWNERSHIP
    // =====================================================

    const checkAppointment = `
        SELECT
            appointments.id,
            counsellors.user_id AS counsellor_user_id

        FROM appointments

        JOIN counsellors
        ON appointments.counsellor_id = counsellors.id

        WHERE appointments.id = ?
    `;

    db.query(
        checkAppointment,
        [appointmentId],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message:
                        "Failed to check appointment"
                });

            }

            if (result.length === 0) {

                return res.status(404).json({
                    message:
                        "Appointment not found"
                });

            }

            const appointment = result[0];

            // =====================================================
            // CHECK COUNSELLOR OWNERSHIP
            // =====================================================

            if (
                Number(
                    appointment.counsellor_user_id
                ) !== Number(counsellorUserId)
            ) {

                return res.status(403).json({
                    message:
                        "You are not authorized to update this appointment"
                });

            }

            // =====================================================
            // REMOVE MEETING LINK
            // =====================================================

            const sql = `
                UPDATE appointments
                SET meeting_link = NULL
                WHERE id = ?
            `;

            db.query(
                sql,
                [appointmentId],
                (err, result) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            message:
                                "Failed to remove meeting link"
                        });

                    }

                    return res.json({
                        message:
                            "Meeting link removed successfully"
                    });

                }
            );

        }
    );

});


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// ADMIN ONLY MIDDLEWARE
// =====================================================

const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admins only."
        });
    }

    next();
};


// =====================================================
// GET ALL USERS
// =====================================================

router.get("/users", authMiddleware, adminOnly, (req, res) => {

    const sql = `
        SELECT id, name, email, role, created_at
        FROM users
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to fetch users"
            });
        }

        res.json({
            message: "Users fetched successfully",
            users: result
        });
    });
});


// =====================================================
// DELETE USER
// =====================================================

router.delete("/users/:id", authMiddleware, adminOnly, (req, res) => {

    const userId = req.params.id;

    // STEP 1:
    // Delete appointments where this user is the student

    const deleteStudentAppointments = `
        DELETE FROM appointments
        WHERE student_id = ?
    `;

    db.query(deleteStudentAppointments, [userId], (err) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to delete student appointments"
            });
        }


        // STEP 2:
        // Check whether this user is a counsellor

        const findCounsellor = `
            SELECT id
            FROM counsellors
            WHERE user_id = ?
        `;

        db.query(findCounsellor, [userId], (err, counsellorResult) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Failed to find counsellor"
                });
            }


            // STEP 3:
            // If user is counsellor, delete counsellor appointments

            const deleteCounsellorAppointments = (callback) => {

                if (counsellorResult.length === 0) {
                    return callback();
                }

                const counsellorId = counsellorResult[0].id;

                const sql = `
                    DELETE FROM appointments
                    WHERE counsellor_id = ?
                `;

                db.query(sql, [counsellorId], (err) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            message: "Failed to delete counsellor appointments"
                        });
                    }

                    callback();
                });
            };


            deleteCounsellorAppointments(() => {

                // STEP 4:
                // Delete student profile

                const deleteStudentProfile = `
                    DELETE FROM student_profiles
                    WHERE user_id = ?
                `;

                db.query(deleteStudentProfile, [userId], (err) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            message: "Failed to delete student profile"
                        });
                    }


                    // STEP 5:
                    // Delete counsellor profile

                    const deleteCounsellorProfile = `
                        DELETE FROM counsellors
                        WHERE user_id = ?
                    `;

                    db.query(deleteCounsellorProfile, [userId], (err) => {

                        if (err) {
                            console.log(err);

                            return res.status(500).json({
                                message: "Failed to delete counsellor profile"
                            });
                        }


                        // STEP 6:
                        // Finally delete user

                        const deleteUser = `
                            DELETE FROM users
                            WHERE id = ?
                        `;

                        db.query(deleteUser, [userId], (err, result) => {

                            if (err) {
                                console.log(err);

                                return res.status(500).json({
                                    message: "Failed to delete user"
                                });
                            }


                            if (result.affectedRows === 0) {

                                return res.status(404).json({
                                    message: "User not found"
                                });

                            }


                            res.json({
                                message: "User deleted successfully"
                            });

                        });

                    });

                });

            });

        });

    });

});


// =====================================================
// GET ALL COUNSELLORS
// =====================================================

router.get("/counsellors", authMiddleware, adminOnly, (req, res) => {

    const sql = `
    SELECT
        counsellors.id,
        counsellors.user_id,
        users.name,
        users.email,
        counsellors.specialization,
        counsellors.experience,
        counsellors.bio,
        counsellors.consultation_fee,
        counsellors.verification_status
    FROM counsellors
    JOIN users
    ON counsellors.user_id = users.id
    ORDER BY counsellors.id DESC
`;
    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to fetch counsellors"
            });
        }

        res.json({
            message: "Counsellors fetched successfully",
            counsellors: result
        });

    });

});



// =====================================================
// APPROVE COUNSELLOR
// =====================================================

router.put("/counsellors/:id/approve", authMiddleware, adminOnly, (req, res) => {

    const counsellorId = req.params.id;

    const sql = `
        UPDATE counsellors
        SET verification_status = 'approved'
        WHERE id = ?
    `;

    db.query(sql, [counsellorId], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to approve counsellor"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Counsellor not found"
            });
        }

        res.json({
            message: "Counsellor approved successfully"
        });

    });

});


// =====================================================
// REJECT COUNSELLOR
// =====================================================

router.put("/counsellors/:id/reject", authMiddleware, adminOnly, (req, res) => {

    const counsellorId = req.params.id;

    const sql = `
        UPDATE counsellors
        SET verification_status = 'rejected'
        WHERE id = ?
    `;

    db.query(sql, [counsellorId], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to reject counsellor"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Counsellor not found"
            });
        }

        res.json({
            message: "Counsellor rejected successfully"
        });

    });

});


// =====================================================
// RESET COUNSELLOR TO PENDING
// =====================================================

router.put("/counsellors/:id/pending", authMiddleware, adminOnly, (req, res) => {

    const counsellorId = req.params.id;

    const sql = `
        UPDATE counsellors
        SET verification_status = 'pending'
        WHERE id = ?
    `;

    db.query(sql, [counsellorId], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to change counsellor status"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Counsellor not found"
            });
        }

        res.json({
            message: "Counsellor status changed to pending"
        });

    });

});

// =====================================================
// GET ALL APPOINTMENTS
// =====================================================

router.get("/appointments", authMiddleware, adminOnly, (req, res) => {

    const sql = `
        SELECT
            appointments.id,
            appointments.student_id,
            appointments.counsellor_id,
            appointments.appointment_date,
            appointments.appointment_time,
            appointments.status,
            students.name AS student_name,
            counsellors_user.name AS counsellor_name
        FROM appointments
        JOIN users AS students
            ON appointments.student_id = students.id
        JOIN counsellors
            ON appointments.counsellor_id = counsellors.id
        JOIN users AS counsellors_user
            ON counsellors.user_id = counsellors_user.id
        ORDER BY appointments.id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to fetch appointments"
            });
        }

        res.json({
            message: "Appointments fetched successfully",
            appointments: result
        });

    });

});


// =====================================================
// EXPORT
// =====================================================

module.exports = router;
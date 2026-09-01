const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// CREATE STUDENT PROFILE
// =====================================================

router.post("/", authMiddleware, (req, res) => {
    const { education, interests, skills } = req.body;
    const userId = req.user.id;

    // Basic validation
    if (!education || !interests || !skills) {
        return res.status(400).json({
            message: "Education, interests and skills are required"
        });
    }

    // Check if profile already exists
    const checkSql = `
        SELECT id
        FROM student_profiles
        WHERE user_id = ?
    `;

    db.query(checkSql, [userId], (checkErr, checkResult) => {
        if (checkErr) {
            console.log(checkErr);

            return res.status(500).json({
                message: "Failed to check profile"
            });
        }

        // Profile already exists
        if (checkResult.length > 0) {
            return res.status(409).json({
                message: "Profile already exists"
            });
        }

        // Create new profile
        const insertSql = `
            INSERT INTO student_profiles
            (user_id, education, interests, skills)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            insertSql,
            [userId, education, interests, skills],
            (err, result) => {
                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message: "Profile creation failed"
                    });
                }

                res.status(201).json({
                    message: "Student profile created successfully",
                    profileId: result.insertId,
                    profile: {
                        education,
                        interests,
                        skills
                    }
                });
            }
        );
    });
});


// =====================================================
// GET STUDENT PROFILE
// =====================================================

router.get("/", authMiddleware, (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT *
        FROM student_profiles
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to fetch profile"
            });
        }

        // New user has not created profile yet
        if (result.length === 0) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.json({
            message: "Profile fetched successfully",
            profile: result[0]
        });
    });
});


// =====================================================
// UPDATE STUDENT PROFILE
// =====================================================

router.put("/", authMiddleware, (req, res) => {
    const { education, interests, skills } = req.body;
    const userId = req.user.id;

    // Basic validation
    if (!education || !interests || !skills) {
        return res.status(400).json({
            message: "Education, interests and skills are required"
        });
    }

    const sql = `
        UPDATE student_profiles
        SET education = ?,
            interests = ?,
            skills = ?
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [education, interests, skills, userId],
        (err, result) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Profile update failed"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Profile not found"
                });
            }

            res.json({
                message: "Profile updated successfully",
                profile: {
                    education,
                    interests,
                    skills
                }
            });
        }
    );
});


// =====================================================
// EXPORT
// =====================================================

module.exports = router;
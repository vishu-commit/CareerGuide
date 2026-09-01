
const express = require("express");
const router = express.Router();

const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// GET COURSES BY CAREER
router.get("/:careerId", authMiddleware, (req, res) => {

    const careerId = req.params.careerId;

    const sql = `
        SELECT
            id,
            career_id,
            course_name,
            duration,
            description
        FROM courses
        WHERE career_id = ?
        ORDER BY id
    `;

    db.query(sql, [careerId], (err, result) => {

        if (err) {
            console.log("Course Error:", err);

            return res.status(500).json({
                message: "Failed to fetch courses"
            });
        }

        res.json({
            message: "Courses fetched successfully",
            courses: result
        });
    });
});

module.exports = router;


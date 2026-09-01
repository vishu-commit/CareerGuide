const express = require("express");
const router = express.Router();

const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// GET ROADMAP BY CAREER
router.get("/:careerId", authMiddleware, (req, res) => {
    const careerId = req.params.careerId;

const sql = `
    SELECT
        id,
        career_id,
        step_number,
        title,
        description
    FROM roadmaps
    WHERE career_id = ?
    ORDER BY step_number
`;

db.query(sql, [careerId], (err, result) => {

    if (err) {
        console.log("Roadmap Error:", err);

        return res.status(500).json({
            message: "Failed to fetch roadmap"
        });
    }

    res.json({
        message: "Roadmap fetched successfully",
        roadmap: result
    });
});
});

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// GET ALL CAREERS
// =====================================================

router.get("/", authMiddleware, (req, res) => {

    const sql = `
        SELECT
            id,
            title,
            description,
            skills,
            eligibility,
            education_required,
            job_roles,
            starting_salary
        FROM careers
        ORDER BY id
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log("Career Error:", err);

            return res.status(500).json({
                message: "Failed to fetch careers"
            });
        }

        res.json({
            message: "Careers fetched successfully",
            careers: result
        });
    });
});

// =====================================================
// GET SINGLE CAREER
// =====================================================




        router.get("/:id", authMiddleware, (req, res) => {

    const careerId = req.params.id;

    const sql = `
        SELECT
            id,
            title,
            description,
            skills,
            eligibility,
            education_required,
            job_roles,
            starting_salary
        FROM careers
        WHERE id = ?
    `;

    db.query(sql, [careerId], (err, result) => {

        if (err) {
            console.log("Career Error:", err);

            return res.status(500).json({
                message: "Failed to fetch career"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Career not found"
            });
        }

        res.json({
            career: result[0]
        });
    });
});


// =====================================================
// CAREER RECOMMENDATION
// =====================================================

router.get("/recommend/:skill", authMiddleware, (req, res) => {

    const skill = req.params.skill.trim();

    if (!skill) {
        return res.status(400).json({
            message: "Skill is required"
        });
    }

    const searchSkill = `%${skill}%`;

    const sql = `
    SELECT
        id,
        title,
        description,
        skills,
        eligibility,
        education_required,
        job_roles,
        starting_salary
    FROM careers
    WHERE
        skills LIKE ?
        OR title LIKE ?
        OR description LIKE ?
    ORDER BY id
`;
    db.query(
        sql,
        [searchSkill, searchSkill, searchSkill],
        (err, result) => {

            if (err) {
                console.log("Recommendation Error:", err);

                return res.status(500).json({
                    message: "Failed to get recommendation"
                });
            }

            if (result.length === 0) {
                return res.json({
                    message: "No suitable career found",
                    careers: []
                });
            }

            res.json({
                message: "Career recommendations found",
                careers: result
            });
        }
    );
});


module.exports = router;
const express = require("express");
const router = express.Router();

const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// GET COLLEGES BY COURSE, CITY AND MAXIMUM BUDGET
router.get("/", authMiddleware, (req, res) => {
    const { course, city, maxFee } = req.query;

let sql = `
    SELECT
        id,
        college_name,
        city,
        state,
        course,
        annual_fee,
        rating,
        description
    FROM colleges
    WHERE 1 = 1
`;

const values = [];

if (course) {
    sql += " AND course LIKE ?";
    values.push("%" + course + "%");
}

if (city) {
    sql += " AND city LIKE ?";
    values.push("%" + city + "%");
}

if (maxFee) {
    sql += " AND annual_fee <= ?";
    values.push(Number(maxFee));
}

sql += " ORDER BY rating DESC, annual_fee ASC";

db.query(sql, values, (err, result) => {

    if (err) {
        console.log("College Error:", err);

        return res.status(500).json({
            message: "Failed to fetch colleges"
        });
    }

    res.json({
        message: "Colleges fetched successfully",
        colleges: result
    });
});
});

module.exports = router;
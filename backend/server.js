const express = require("express");
const cors = require("cors");
require("./db");

const authRoutes = require("./routes/authRoutes");
const careerRoutes = require("./routes/careerRoutes");
const courseRoutes = require("./routes/courseRoutes");
const profileRoutes = require("./routes/profileRoutes");
const counsellorRoutes = require("./routes/counsellorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const aiCounsellingRoutes = require("./routes/aiCounsellingRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/counsellors", counsellorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/ai-counselling", aiCounsellingRoutes);



app.get("/", (req, res) => {
    res.send("CareerGuide Backend is Running!");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
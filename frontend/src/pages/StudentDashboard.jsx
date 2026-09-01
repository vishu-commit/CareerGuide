import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./StudentDashboard.css";

function StudentDashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    // =====================================================
    // STATES
    // =====================================================

    const [profile, setProfile] = useState(null);
    const [profileExists, setProfileExists] = useState(false);

    const [recommendations, setRecommendations] = useState([]);
    const [selectedCareer, setSelectedCareer] = useState(null);

    const [courses, setCourses] = useState([]);
    const [roadmap, setRoadmap] = useState([]);

    const [city, setCity] = useState("");
    const [maxFee, setMaxFee] = useState("");

    const [colleges, setColleges] = useState([]);
    const [collegeMessage, setCollegeMessage] = useState("");

    const [message, setMessage] = useState("");

    const [editing, setEditing] = useState(false);

    const [education, setEducation] = useState("");
    const [interests, setInterests] = useState("");
    const [skills, setSkills] = useState("");

    // =====================================================
    // FETCH PROFILE
    // =====================================================

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await api.get("/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const userProfile = response.data.profile;

                setProfile(userProfile);
                setProfileExists(true);

                setEducation(userProfile.education || "");
                setInterests(userProfile.interests || "");
                setSkills(userProfile.skills || "");

                setEditing(false);
                setMessage("");

            } catch (error) {
                console.log(
                    "Profile Error:",
                    error.response?.data || error
                );

                if (error.response?.status === 404) {
                    setProfile(null);
                    setProfileExists(false);

                    setEducation("");
                    setInterests("");
                    setSkills("");

                    setEditing(true);
                    setMessage("");

                    return;
                }

                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");
                    return;
                }

                setMessage(
                    error.response?.data?.message ||
                    "Failed to load profile."
                );
            }
        };

        fetchProfile();
    }, [navigate]);

    // =====================================================
    // GET AI COUNSELLING RESULTS
    // =====================================================

    useEffect(() => {
        if (
            location.state &&
            location.state.recommendations
        ) {
            const aiRecommendations =
                location.state.recommendations;

            setRecommendations(aiRecommendations);

            setSelectedCareer(null);
            setCourses([]);
            setRoadmap([]);
            setColleges([]);

            setCity("");
            setMaxFee("");
            setCollegeMessage("");
            setMessage("");
        }
    }, [location.state]);

    // =====================================================
    // FETCH COURSES
    // =====================================================

    const fetchCourses = async (careerId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await api.get(
                `/courses/${careerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCourses(
                response.data.courses || []
            );

        } catch (error) {
            console.log(
                "Course Error:",
                error.response?.data || error
            );

            setCourses([]);

            setMessage(
                error.response?.data?.message ||
                "Failed to load courses."
            );
        }
    };

    // =====================================================
    // FETCH ROADMAP
    // =====================================================

    const fetchRoadmap = async (careerId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await api.get(
                `/roadmaps/${careerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setRoadmap(
                response.data.roadmap || []
            );

        } catch (error) {
            console.log(
                "Roadmap Error:",
                error.response?.data || error
            );

            setRoadmap([]);
        }
    };

    // =====================================================
    // COLLEGE COURSE MAPPING
    // =====================================================

    const getCollegeCourse = (careerTitle) => {
        if (!careerTitle) {
            return "";
        }

        const title =
            careerTitle
                .toLowerCase()
                .trim();

        // COMPUTER SCIENCE

        const technologyKeywords = [
            "software developer",
            "full stack developer",
            "frontend developer",
            "backend developer",
            "mobile app developer",
            "ai/ml engineer",
            "ai engineer",
            "machine learning engineer",
            "data engineer",
            "cybersecurity analyst",
            "ethical hacker",
            "cloud engineer",
            "devops engineer",
            "game developer",
            "blockchain developer",
            "robotics engineer",
            "iot engineer",
            "ar/vr developer",
            "ai product specialist",
            "prompt",
            "generative ai",
            "drone operator",
            "drone technology",
            "web developer",
            "app developer",
            "technology"
        ];

        if (
            technologyKeywords.some(
                keyword => title.includes(keyword)
            )
        ) {
            return "Computer Science";
        }

        // DATA SCIENCE

        const dataKeywords = [
            "data analyst",
            "data scientist",
            "data engineer",
            "business analyst",
            "business analytics",
            "financial analyst",
            "investment analyst",
            "data science",
            "analytics"
        ];

        if (
            dataKeywords.some(
                keyword => title.includes(keyword)
            )
        ) {
            return "Data Science";
        }

        // DIGITAL MARKETING

        const digitalMarketingKeywords = [
            "digital marketing",
            "seo",
            "search engine optimization",
            "social media manager",
            "social media management",
            "social media marketing",
            "content marketing",
            "online marketing",
            "marketing specialist"
        ];

        if (
            digitalMarketingKeywords.some(
                keyword => title.includes(keyword)
            )
        ) {
            return "Digital Marketing";
        }

        // FASHION DESIGN

        const fashionKeywords = [
            "fashion designer",
            "fashion design",
            "fashion stylist",
            "stylist",
            "fashion image consultant",
            "garment",
            "tailor",
            "tailoring",
            "stitching",
            "fashion merchandising"
        ];

        if (
            fashionKeywords.some(
                keyword => title.includes(keyword)
            )
        ) {
            return "Fashion Design";
        }

        // GRAPHIC DESIGN

        const graphicDesignKeywords = [
            "graphic designer",
            "graphic design",
            "illustrator",
            "illustration",
            "visual designer",
            "visual design",
            "branding designer",
            "brand designer"
        ];

        if (
            graphicDesignKeywords.some(
                keyword => title.includes(keyword)
            )
        ) {
            return "Graphic Design";
        }

        // UI/UX DESIGN

        const uiuxKeywords = [
            "ui/ux designer",
            "ui ux designer",
            "ui/ux design",
            "ux designer",
            "ui designer",
            "product designer",
            "product design",
            "user experience",
            "user interface"
        ];

        if (
            uiuxKeywords.some(
                keyword => title.includes(keyword)
            )
        ) {
            return "UI/UX Design";
        }

        // INTERIOR DESIGN

        const interiorKeywords = [
            "interior designer",
            "interior design",
            "space designer",
            "interior architect"
        ];

        if (
            interiorKeywords.some(
                keyword => title.includes(keyword)
            )
        ) {
            return "Interior Design";
        }

        // ANIMATION & MULTIMEDIA

        const animationKeywords = [
            "animator",
            "animation",
            "3d artist",
            "3d modelling",
            "3d modeler",
            "multimedia",
            "vfx",
            "visual effects",
            "motion graphics",
            "video editor",
            "video editing",
            "film editor",
            "game artist"
        ];

        if (
            animationKeywords.some(
                keyword => title.includes(keyword)
            )
        ) {
            return "Animation & Multimedia";
        }

        // BUSINESS MANAGEMENT

        const businessKeywords = [
            "entrepreneur",
            "entrepreneurship",
            "startup management",
            "business management",
            "business manager",
            "e-commerce",
            "ecommerce",
            "e-commerce management",
            "product manager",
            "product management",
            "project manager",
            "project management",
            "human resource",
            "hr manager",
            "hr management",
            "financial management",
            "management consultant"
        ];

        if (
            businessKeywords.some(
                keyword => title.includes(keyword)
            )
        ) {
            return "Business Management";
        }

        // LAW

        const lawKeywords = [
            "lawyer",
            "law",
            "legal",
            "advocate",
            "llb",
            "corporate law",
            "legal advisor",
            "legal consultant",
            "company secretary"
        ];

        if (
            lawKeywords.some(
                keyword => title.includes(keyword)
            )
        ) {
            return "Law";
        }

        // PHARMACY

        const pharmacyKeywords = [
            "pharmacist",
            "pharmacy",
            "pharmaceutical",
            "pharma",
            "b.pharm",
            "d.pharm"
        ];

        if (
            pharmacyKeywords.some(
                keyword => title.includes(keyword)
            )
        ) {
            return "Pharmacy";
        }

        // PHYSIOTHERAPY

        const physiotherapyKeywords = [
            "physiotherapist",
            "physiotherapy",
            "physical therapist",
            "sports physiotherapy"
        ];

        if (
            physiotherapyKeywords.some(
                keyword => title.includes(keyword)
            )
        ) {
            return "Physiotherapy";
        }

        // HOSPITALITY

        const hospitalityKeywords = [
            "hospitality",
            "hotel management",
            "hotel manager",
            "chef",
            "culinary",
            "baking",
            "bakery",
            "pastry",
            "food production",
            "hospitality management"
        ];

        if (
            hospitalityKeywords.some(
                keyword => title.includes(keyword)
            )
        ) {
            return "Hospitality Management";
        }

        // TRAVEL & TOURISM

        const travelKeywords = [
            "travel",
            "tourism",
            "tourist",
            "travel consultant",
            "tourism management",
            "travel management",
            "tour operator"
        ];

        if (
            travelKeywords.some(
                keyword => title.includes(keyword)
            )
        ) {
            return "Travel & Tourism";
        }

        // FALLBACKS

        if (
            title.includes("design") ||
            title.includes("designer") ||
            title.includes("artist")
        ) {
            return "UI/UX Design";
        }

        if (
            title.includes("data") ||
            title.includes("analyst") ||
            title.includes("analytics")
        ) {
            return "Data Science";
        }

        if (
            title.includes("developer") ||
            title.includes("engineer") ||
            title.includes("technology") ||
            title.includes("software")
        ) {
            return "Computer Science";
        }

        return "";
    };

    // =====================================================
    // FETCH COLLEGES
    // =====================================================

    const fetchColleges = async () => {
        if (!selectedCareer) {
            setCollegeMessage(
                "Please select a career first."
            );
            return;
        }

        if (!city.trim()) {
            setCollegeMessage(
                "Please enter your city."
            );
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const collegeCourse =
            getCollegeCourse(
                selectedCareer.title
            );

        if (!collegeCourse) {
            setCollegeMessage(
                `Colleges for ${selectedCareer.title} are not available yet. We are adding more college options soon.`
            );

            setColleges([]);
            return;
        }

        try {
            const response = await api.get(
                `/colleges?course=${encodeURIComponent(
                    collegeCourse
                )}&city=${encodeURIComponent(
                    city.trim()
                )}&maxFee=${encodeURIComponent(
                    maxFee
                )}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const result =
                response.data.colleges || [];

            setColleges(result);

            if (result.length === 0) {
                setCollegeMessage(
                    `No ${collegeCourse} colleges found in ${city}${
                        maxFee
                            ? ` within ₹${Number(
                                  maxFee
                              ).toLocaleString(
                                  "en-IN"
                              )} annual budget`
                            : ""
                    }. Try another city or increase your budget.`
                );
            } else {
                setCollegeMessage("");
            }

        } catch (error) {
            console.log(
                "College Error:",
                error.response?.data || error
            );

            setColleges([]);

            setCollegeMessage(
                error.response?.data?.message ||
                "Failed to load colleges."
            );
        }
    };

    // =====================================================
    // SELECT CAREER
    // =====================================================

    const handleCareerSelect = async (career) => {
        setSelectedCareer(career);

        setCourses([]);
        setRoadmap([]);
        setColleges([]);

        setCity("");
        setMaxFee("");

        setCollegeMessage("");
        setMessage("");

        await fetchCourses(career.id);
        await fetchRoadmap(career.id);
    };

    // =====================================================
    // CREATE / UPDATE PROFILE
    // =====================================================

    const handleProfileSave = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const cleanEducation =
            education.trim();

        const cleanInterests =
            interests.trim();

        const cleanSkills =
            skills.trim();

        if (
            !cleanEducation ||
            !cleanInterests ||
            !cleanSkills
        ) {
            setMessage(
                "Please fill Education, Interests and Skills."
            );
            return;
        }

        try {

            // EXISTING PROFILE

            if (profileExists) {

                const response = await api.put(
                    "/profile",
                    {
                        education: cleanEducation,
                        interests: cleanInterests,
                        skills: cleanSkills
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setProfile({
                    ...profile,
                    education: cleanEducation,
                    interests: cleanInterests,
                    skills: cleanSkills
                });

                setProfileExists(true);
                setEditing(false);

                setEducation(cleanEducation);
                setInterests(cleanInterests);
                setSkills(cleanSkills);

                setMessage(
                    response.data.message ||
                    "Profile updated successfully!"
                );

                return;
            }

            // NEW PROFILE

            const response = await api.post(
                "/profile",
                {
                    education: cleanEducation,
                    interests: cleanInterests,
                    skills: cleanSkills
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setProfile({
                education: cleanEducation,
                interests: cleanInterests,
                skills: cleanSkills
            });

            setProfileExists(true);
            setEditing(false);

            setEducation(cleanEducation);
            setInterests(cleanInterests);
            setSkills(cleanSkills);

            setMessage(
                response.data.message ||
                "Profile created successfully!"
            );

        } catch (error) {

            console.log(
                "Profile Save Error:",
                error.response?.data || error
            );

            if (
                error.response?.status === 409 ||
                error.response?.data?.message
                    ?.toLowerCase()
                    .includes("already exists")
            ) {
                setProfileExists(true);

                setMessage(
                    "Profile already exists. Please edit your profile instead."
                );

                return;
            }

            if (
                error.response?.status === 401
            ) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");
                return;
            }

            setMessage(
                error.response?.data?.message ||
                "Profile could not be saved."
            );
        }
    };

    // =====================================================
    // OPEN EDIT PROFILE
    // =====================================================

    const handleEditProfile = () => {
        if (!profile) {
            return;
        }

        setEducation(
            profile.education || ""
        );

        setInterests(
            profile.interests || ""
        );

        setSkills(
            profile.skills || ""
        );

        setMessage("");
        setEditing(true);
    };

    // =====================================================
    // OPEN CREATE PROFILE
    // =====================================================

    const handleCreateProfile = () => {
        setEducation("");
        setInterests("");
        setSkills("");

        setMessage("");
        setEditing(true);
    };

    // =====================================================
    // CANCEL PROFILE EDIT
    // =====================================================

    const handleCancelProfile = () => {
        setEditing(false);
        setMessage("");

        if (profileExists && profile) {
            setEducation(
                profile.education || ""
            );

            setInterests(
                profile.interests || ""
            );

            setSkills(
                profile.skills || ""
            );
        } else {
            setEducation("");
            setInterests("");
            setSkills("");
        }
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    // =====================================================
    // START NEW AI COUNSELLING
    // =====================================================

    const startAICounselling = () => {
        setRecommendations([]);
        setSelectedCareer(null);

        setCourses([]);
        setRoadmap([]);
        setColleges([]);

        setCity("");
        setMaxFee("");

        setCollegeMessage("");
        setMessage("");

        navigate("/ai-counselling");
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="dashboard">

            {/* =================================================
                NAVBAR
            ================================================= */}

            <nav className="navbar">

                <h2>
                    CareerGuide
                </h2>

                <button
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </nav>


            <main className="dashboard-content">

                {/* =================================================
                    WELCOME
                ================================================= */}

                <section className="welcome">

                    <h1>
                        Welcome to CareerGuide 👋
                    </h1>

                    <p>
                        Get personalized career guidance
                        based on your interests, skills
                        and preferences.
                    </p>

                </section>


                {/* =================================================
                    FREE AI COUNSELLING
                ================================================= */}

                <section
                    className="ai-counselling-section"
                >

                    <div
                        className="ai-counselling-content"
                    >

                        <div className="ai-icon">
                            🤖
                        </div>

                        <div>

                            <h2>
                                Free AI Career Counselling
                            </h2>

                            <p>
                                Confused about which career
                                is right for you?
                            </p>

                            <p>
                                Our AI analyses your education,
                                interests, skills and preferences
                                to suggest careers that match you.
                            </p>

                            <button
                                type="button"
                                className="ai-counselling-button"
                                onClick={
                                    startAICounselling
                                }
                            >
                                🤖 Start Free AI Counselling →
                            </button>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (
                    <p className="message">
                        {message}
                    </p>
                )}


                {/* =================================================
                    FIND YOUR RIGHT CAREER
                    MOVED ABOVE MY PROFILE
                ================================================= */}

                <section className="empty-career-section">

                    <h2>
                        🎯 Find Your Right Career
                    </h2>

                    <p>
                        Get personalized career recommendations
                        based on your interests, skills and preferences.
                    </p>

                </section>


                {/* =================================================
                    MY PROFILE
                ================================================= */}

                <section className="profile-section">

                    <h2>
                        👤 My Profile
                    </h2>


                    {/* NEW USER */}

                    {!profileExists &&
                        !editing && (

                        <div
                            className="empty-profile-card"
                        >

                            <div
                                className="empty-profile-icon"
                            >
                                👤
                            </div>

                            <h3>
                                Create Your Profile
                            </h3>

                            <p>
                                Tell us about yourself so that
                                CareerGuide can provide better
                                career recommendations.
                            </p>

                            <button
                                type="button"
                                className="edit-button"
                                onClick={
                                    handleCreateProfile
                                }
                            >
                                ✏️ Create Profile
                            </button>

                        </div>
                    )}


                    {/* EXISTING PROFILE */}

                    {profileExists &&
                        !editing &&
                        profile && (

                        <>

                            <div
                                className="profile-card"
                            >

                                <div>

                                    <span>
                                        🎓 Education
                                    </span>

                                    <strong>
                                        {profile.education ||
                                            "Not added"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        🎯 Interests
                                    </span>

                                    <strong>
                                        {profile.interests ||
                                            "Not added"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        🛠️ Skills
                                    </span>

                                    <strong>
                                        {profile.skills ||
                                            "Not added"}
                                    </strong>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="edit-button"
                                onClick={
                                    handleEditProfile
                                }
                            >
                                ✏️ Edit Profile
                            </button>

                        </>
                    )}


                    {/* CREATE / EDIT PROFILE */}

                    {editing && (

                        <form
                            className="profile-edit"
                            onSubmit={
                                handleProfileSave
                            }
                        >

                            <h3>
                                {profileExists
                                    ? "Edit Your Profile"
                                    : "Create Your Profile"}
                            </h3>

                            <p>
                                Add your details to get
                                personalized career guidance.
                            </p>


                            <label>
                                Education
                            </label>

                            <input
                                type="text"
                                value={education}
                                onChange={(e) =>
                                    setEducation(
                                        e.target.value
                                    )
                                }
                                placeholder="Example: BCA Final Year"
                            />


                            <label>
                                Interests
                            </label>

                            <input
                                type="text"
                                value={interests}
                                onChange={(e) =>
                                    setInterests(
                                        e.target.value
                                    )
                                }
                                placeholder="Example: Web Development, AI"
                            />


                            <label>
                                Skills
                            </label>

                            <input
                                type="text"
                                value={skills}
                                onChange={(e) =>
                                    setSkills(
                                        e.target.value
                                    )
                                }
                                placeholder="Example: Java, React, SQL"
                            />


                            <div
                                className="profile-buttons"
                            >

                                <button
                                    type="submit"
                                    className="save-button"
                                >
                                    {profileExists
                                        ? "💾 Save Changes"
                                        : "✨ Create Profile"}
                                </button>


                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={
                                        handleCancelProfile
                                    }
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>
                    )}

                </section>


                {/* =================================================
                    PERSONALIZED CAREERS
                ================================================= */}

                {recommendations.length > 0 && (

                    <section>

                        <h2>
                            ⭐ Your Personalized Career Recommendations
                        </h2>

                        <p>
                            These careers are recommended
                            based on your AI counselling answers.
                        </p>


                        <div className="career-grid">

                            {recommendations.map(
                                (career, index) => (

                                <div
                                    className="career-card recommended"
                                    key={
                                        career.id ||
                                        career.title ||
                                        index
                                    }
                                >

                                    <div
                                        className="career-rank"
                                    >
                                        #{index + 1}
                                    </div>


                                    <h3>
                                        {career.title}
                                    </h3>


                                    {career.category && (
                                        <span>
                                            {career.category}
                                        </span>
                                    )}


                                    {career.match_percentage !==
                                        undefined && (

                                        <div
                                            className="match-percentage"
                                        >
                                            🎯{" "}
                                            {
                                                career.match_percentage
                                            }%
                                            Match
                                        </div>
                                    )}


                                    <p>
                                        {career.description ||
                                            "Career description is not available yet."}
                                    </p>


                                    {career.skills && (

                                        <p>
                                            <strong>
                                                Skills:
                                            </strong>{" "}
                                            {career.skills}
                                        </p>
                                    )}


                                    <button
                                        type="button"
                                        className="edit-button"
                                        onClick={() =>
                                            handleCareerSelect(
                                                career
                                            )
                                        }
                                    >

                                        {selectedCareer?.id ===
                                            career.id
                                            ? "✓ Selected Career"
                                            : "Select Career"}

                                    </button>

                                </div>
                            )
                            )}

                        </div>

                    </section>
                )}


                {/* =================================================
                    SELECTED CAREER
                ================================================= */}

                {selectedCareer && (

                    <section>

                        <h2>
                            🎯 Selected Career
                        </h2>


                        <div
                            className="selected-career-card"
                        >

                            <h2>
                                {selectedCareer.title}
                            </h2>


                            {selectedCareer.match_percentage !==
                                undefined && (

                                <div
                                    className="match-percentage"
                                >
                                    🎯{" "}
                                    {
                                        selectedCareer.match_percentage
                                    }%
                                    Match
                                </div>
                            )}


                            <p>
                                {selectedCareer.description ||
                                    "Career description is not available yet."}
                            </p>

                        </div>

                    </section>
                )}


                {/* =================================================
                    COURSES
                ================================================= */}

                {selectedCareer && (

                    <section>

                        <h2>
                            🎓 Courses for{" "}
                            {selectedCareer.title}
                        </h2>


                        {courses.length > 0 ? (

                            <div className="career-grid">

                                {courses.map(
                                    (course) => (

                                    <div
                                        className="career-card"
                                        key={course.id}
                                    >

                                        <h3>
                                            {course.course_name}
                                        </h3>

                                        <p>
                                            {course.description}
                                        </p>

                                        <span>
                                            Duration:{" "}
                                            {course.duration}
                                        </span>

                                    </div>
                                ))}

                            </div>

                        ) : (

                            <p>
                                No courses found for this career.
                            </p>

                        )}

                    </section>
                )}


                {/* =================================================
                    CAREER DETAILS
                ================================================= */}

                {selectedCareer && (

                    <section
                        className="career-details-section"
                    >

                        <div
                            className="section-heading"
                        >

                            <span
                                className="section-icon"
                            >
                                📋
                            </span>

                            <div>

                                <h2>
                                    Career Details
                                </h2>

                                <p>
                                    Everything you should know
                                    before choosing{" "}
                                    {selectedCareer.title}.
                                </p>

                            </div>

                        </div>


                        <div
                            className="career-details-grid"
                        >

                            {/* ELIGIBILITY */}

                            <div
                                className="career-detail-card"
                            >

                                <div
                                    className="career-detail-icon"
                                >
                                    🎯
                                </div>

                                <div>

                                    <h3>
                                        Eligibility
                                    </h3>

                                    <p>
                                        {selectedCareer.eligibility ||
                                            "Eligibility details are not available yet."}
                                    </p>

                                </div>

                            </div>


                            {/* EDUCATION */}

                            <div
                                className="career-detail-card"
                            >

                                <div
                                    className="career-detail-icon"
                                >
                                    📚
                                </div>

                                <div>

                                    <h3>
                                        Education Required
                                    </h3>

                                    <p>
                                        {selectedCareer.education_required ||
                                            "Education requirements are not available yet."}
                                    </p>

                                </div>

                            </div>


                            {/* SKILLS */}

                            <div
                                className="career-detail-card"
                            >

                                <div
                                    className="career-detail-icon"
                                >
                                    🛠️
                                </div>

                                <div>

                                    <h3>
                                        Important Skills
                                    </h3>

                                    <p>
                                        {selectedCareer.skills ||
                                            "Skill information is not available yet."}
                                    </p>

                                </div>

                            </div>


                            {/* JOB ROLES */}

                            <div
                                className="career-detail-card"
                            >

                                <div
                                    className="career-detail-icon"
                                >
                                    💼
                                </div>

                                <div>

                                    <h3>
                                        Job Roles
                                    </h3>

                                    <p>
                                        {selectedCareer.job_roles ||
                                            "Job role information is not available yet."}
                                    </p>

                                </div>

                            </div>


                            {/* SALARY */}

                            <div
                                className="career-detail-card salary-card"
                            >

                                <div
                                    className="career-detail-icon"
                                >
                                    💰
                                </div>

                                <div>

                                    <h3>
                                        Starting Salary
                                    </h3>

                                    <p>
                                        {selectedCareer.starting_salary ||
                                            "Salary information is not available yet."}
                                    </p>

                                </div>

                            </div>


                            {/* CATEGORY */}

                            <div
                                className="career-detail-card"
                            >

                                <div
                                    className="career-detail-icon"
                                >
                                    🏷️
                                </div>

                                <div>

                                    <h3>
                                        Career Category
                                    </h3>

                                    <p>
                                        {selectedCareer.category ||
                                            "General Career"}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ABOUT CAREER */}

                        <div
                            className="career-overview-card"
                        >

                            <div
                                className="career-overview-icon"
                            >
                                💡
                            </div>

                            <div>

                                <h3>
                                    About This Career
                                </h3>

                                <p>
                                    {selectedCareer.description ||
                                        "Career description is not available yet."}
                                </p>

                            </div>

                        </div>

                    </section>
                )}


                {/* =================================================
                    ROADMAP
                ================================================= */}

                {selectedCareer && (

                    <section>

                        <h2>
                            🗺️ Career Roadmap
                        </h2>

                        <p>
                            Follow a step-by-step roadmap
                            for your selected career.
                        </p>


                        <button
                            className="roadmap-button"
                            onClick={() =>
                                navigate(
                                    `/roadmap/${selectedCareer.id}`
                                )
                            }
                        >
                            🗺️ View Career Roadmap
                        </button>

                    </section>
                )}


                {/* =================================================
                    FIND COLLEGES
                ================================================= */}

                {selectedCareer && (

                    <section
                        className="recommend-section"
                    >

                        <h2>
                            🏫 Find Colleges
                        </h2>

                        <p>
                            Find colleges based on your
                            selected career, city and budget.
                        </p>


                        <div
                            className="college-course-info"
                        >

                            <strong>
                                Recommended College Course:
                            </strong>{" "}

                            {getCollegeCourse(
                                selectedCareer.title
                            ) ||
                                "Not available yet"}

                        </div>


                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                fetchColleges();
                            }}
                        >

                            <input
                                type="text"
                                placeholder="Example: Delhi"
                                value={city}
                                onChange={(e) =>
                                    setCity(
                                        e.target.value
                                    )
                                }
                            />


                            <input
                                type="number"
                                min="0"
                                placeholder="Maximum annual fee (₹)"
                                value={maxFee}
                                onChange={(e) =>
                                    setMaxFee(
                                        e.target.value
                                    )
                                }
                            />


                            <button
                                type="submit"
                            >
                                🔍 Find Colleges
                            </button>

                        </form>


                        {collegeMessage && (

                            <p className="message">
                                {collegeMessage}
                            </p>

                        )}

                    </section>
                )}


                {/* =================================================
                    COLLEGE RESULTS
                ================================================= */}

                {colleges.length > 0 && (

                    <section>

                        <h2>
                            🏫 Recommended Colleges
                        </h2>

                        <p>
                            Colleges matching your selected
                            career, city and budget.
                        </p>


                        <div className="career-grid">

                            {colleges.map(
                                (college) => (

                                <div
                                    className="career-card college-card"
                                    key={college.id}
                                >

                                    <h3>
                                        {college.college_name}
                                    </h3>


                                    {college.rating && (

                                        <div
                                            className="college-rating"
                                        >
                                            ⭐{" "}
                                            {college.rating}/5
                                        </div>
                                    )}


                                    <p>
                                        {college.description}
                                    </p>


                                    <p>
                                        <strong>
                                            📍 Location:
                                        </strong>{" "}

                                        {college.city},{" "}
                                        {college.state}
                                    </p>


                                    <p>
                                        <strong>
                                            🎓 Course:
                                        </strong>{" "}

                                        {college.course}
                                    </p>


                                    <p>
                                        <strong>
                                            💰 Annual Fee:
                                        </strong>{" "}

                                        ₹
                                        {Number(
                                            college.annual_fee
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>


                                    {maxFee &&
                                        Number(
                                            college.annual_fee
                                        ) <=
                                            Number(maxFee) && (

                                        <span
                                            className="budget-badge"
                                        >
                                            ✓ Within Your Budget
                                        </span>
                                    )}

                                </div>
                            ))}

                        </div>

                    </section>
                )}


                {/* =================================================
                    HUMAN COUNSELLOR
                ================================================= */}

                <section
                    className="dashboard-actions"
                >

                    <h2>
                        👨‍🏫 Need Personal Guidance?
                    </h2>

                    <p>
                        If you still feel confused after
                        AI counselling, you can talk to a
                        professional human counsellor.
                    </p>


                    {/* BUTTONS WITH SPACING */}

                    <div className="dashboard-action-buttons">

                        <button
                            className="edit-button"
                            onClick={() =>
                                navigate("/counsellors")
                            }
                        >
                            👨‍🏫 Find a Counsellor
                        </button>


                        <button
                            className="edit-button"
                            onClick={() =>
                                navigate("/appointments")
                            }
                        >
                            📅 My Appointments
                        </button>


                        <button
                            className="edit-button"
                            onClick={() =>
                                navigate("/counselling-history")
                            }
                        >
                            📋 Counselling History
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default StudentDashboard;
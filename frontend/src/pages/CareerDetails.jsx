import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./CareerDetails.css";

function CareerDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [career, setCareer] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {

        const fetchCareer = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {

                const response = await api.get(
                    `/careers/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setCareer(response.data.career);

            } catch (error) {

                console.log(
                    "Career Details Error:",
                    error.response?.data || error
                );

                setMessage(
                    error.response?.data?.message ||
                    "Failed to load career details"
                );
            }
        };

        fetchCareer();

    }, [id, navigate]);


    if (!career) {

        return (
            <div className="career-details-loading">

                {message ? (
                    <div className="career-error-box">
                        ⚠️ {message}
                    </div>
                ) : (
                    <div className="loading-box">
                        Loading career...
                    </div>
                )}

            </div>
        );
    }


    return (

        <div className="career-details-page">

            {/* ================= BACK ================= */}

            <button
                className="career-back-button"
                onClick={() => navigate("/careers")}
            >
                ← Back to Careers
            </button>


            {/* ================= CAREER HERO ================= */}

            <div className="career-details-hero">

                <div className="career-details-icon">
                    🎯
                </div>

                <div className="career-details-info">

                    <span className="career-label">
                        CAREER PATH
                    </span>

                    <h1>
                        {career.title}
                    </h1>

                    <p>
                        {career.description}
                    </p>

                </div>

            </div>


            {/* ================= SKILLS ================= */}

            <div className="career-skills-section">

                <div className="section-icon">
                    🛠️
                </div>

                <div>

                    <h2>
                        Skills Required
                    </h2>

                    <div className="skills-list">

                        {career.skills &&
                            career.skills
                                .split(",")
                                .map((skill, index) => (

                                    <span
                                        key={index}
                                        className="skill-badge"
                                    >
                                        {skill.trim()}
                                    </span>

                                ))
                        }

                    </div>

                </div>

            </div>


            {/* ================= OPTIONS ================= */}

            <div className="career-options">

                {/* COURSES */}

                <div className="career-option-card">

                    <div className="option-icon course-icon">
                        🎓
                    </div>

                    <div className="option-content">

                        <h2>
                            Courses
                        </h2>

                        <p>
                            Explore courses available for this
                            career and build the right skills
                            for your future.
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate(`/courses/${career.id}`)
                        }
                    >
                        View Courses
                        <span>→</span>
                    </button>

                </div>


                {/* ROADMAP */}

                <div className="career-option-card">

                    <div className="option-icon roadmap-icon">
                        🗺️
                    </div>

                    <div className="option-content">

                        <h2>
                            Career Roadmap
                        </h2>

                        <p>
                            Follow a step-by-step roadmap and
                            understand what you need to do to
                            build this career.
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate(`/roadmap/${career.id}`)
                        }
                    >
                        View Career Roadmap
                        <span>→</span>
                    </button>

                </div>


                {/* COLLEGES */}

                <div className="career-option-card">

                    <div className="option-icon college-icon">
                        🏫
                    </div>

                    <div className="option-content">

                        <h2>
                            Colleges
                        </h2>

                        <p>
                            Find suitable colleges based on
                            your preferred city and budget.
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                `/colleges?career=${career.id}`
                            )
                        }
                    >
                        Find Colleges
                        <span>→</span>
                    </button>

                </div>

            </div>

        </div>
    );
}

export default CareerDetails;
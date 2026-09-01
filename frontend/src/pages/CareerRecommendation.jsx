import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CareerRecommendation.css";

function CareerRecommendation() {

    const [skill, setSkill] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleRecommendation = async (e) => {

        e.preventDefault();

        if (!skill.trim()) {
            setMessage("Please enter a skill.");
            return;
        }

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await api.get(
                `/careers/recommend/${skill.trim()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const result = response.data.careers || [];

            setRecommendations(result);

            if (result.length === 0) {
                setMessage("No suitable career found.");
            } else {
                setMessage("");
            }

        } catch (error) {

            console.log(
                "Recommendation Error:",
                error.response?.data || error
            );

            setRecommendations([]);

            setMessage(
                error.response?.data?.message ||
                "Unable to find career recommendations."
            );
        }
    };

    return (

        <div className="career-recommendation-page">

            {/* ================= HERO ================= */}

            <div className="career-main-header">

                <div className="career-header-icon">
                    🎯
                </div>

                <div>
                    <h1>Find Your Perfect Career</h1>

                    <p>
                        Discover career paths that match your
                        skills, interests and potential.
                    </p>
                </div>

            </div>


            {/* ================= SEARCH SECTION ================= */}

            <div className="career-search-container">

                <div className="career-search-header">

                    <div className="career-search-icon">
                        💡
                    </div>

                    <div>
                        <h2>Career Recommendation</h2>

                        <p>
                            Enter a skill and we'll find suitable
                            career options for you.
                        </p>
                    </div>

                </div>


                <form
                    className="career-search-form"
                    onSubmit={handleRecommendation}
                >

                    <div className="career-input-wrapper">

                        <span>🔍</span>

                        <input
                            type="text"
                            placeholder="Enter a skill e.g. Java, React, Python..."
                            value={skill}
                            onChange={(e) =>
                                setSkill(e.target.value)
                            }
                        />

                    </div>


                    <button type="submit">
                        Find Careers
                    </button>

                </form>


                {message && (
                    <div className="career-message">
                        ⚠️ {message}
                    </div>
                )}

            </div>


            {/* ================= RESULTS ================= */}

            {recommendations.length > 0 && (

                <div className="career-results-section">

                    <div className="career-results-header">

                        <div>
                            <span className="results-label">
                                YOUR RESULTS
                            </span>

                            <h2>
                                ✨ Recommended Careers
                            </h2>

                            <p>
                                Careers matching your skill:
                                <strong> {skill}</strong>
                            </p>
                        </div>

                        <div className="result-count">
                            {recommendations.length}
                            <span> Matches</span>
                        </div>

                    </div>


                    <div className="recommendation-grid">

                        {recommendations.map((career) => (

                            <div
                                className="career-result-card"
                                key={career.id}
                            >

                                <div className="career-card-top">

                                    <div className="career-result-icon">
                                        🚀
                                    </div>

                                    <span className="career-match">
                                        MATCHED
                                    </span>

                                </div>


                                <h3>
                                    {career.name || career.title}
                                </h3>


                                <p className="career-description">
                                    {career.description}
                                </p>


                                {career.skills && (

                                    <div className="career-skills-box">

                                        <span>
                                            🛠️ Skills
                                        </span>

                                        <p>
                                            {career.skills}
                                        </p>

                                    </div>

                                )}


                                <button
                                    className="career-view-button"
                                    onClick={() =>
                                        navigate(
                                            `/careers/${career.id}`
                                        )
                                    }
                                >
                                    View Career
                                    <span>→</span>
                                </button>

                            </div>

                        ))}

                    </div>

                </div>

            )}


            {/* ================= EMPTY STATE ================= */}

            {recommendations.length === 0 && !message && (

                <div className="career-empty-state">

                    <div className="empty-icon">
                        🧭
                    </div>

                    <h2>
                        Your Career Journey Starts Here
                    </h2>

                    <p>
                        Enter a skill above and discover career
                        opportunities that could be right for you.
                    </p>

                </div>

            )}

        </div>
    );
}

export default CareerRecommendation;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AICounsellingHistory.css";

function AICounsellingHistory() {

    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchHistory = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {

                const response = await api.get(
                    "/ai-counselling/history",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log(
                    "AI Counselling History:",
                    response.data
                );

                setSessions(
                    response.data.sessions || []
                );

            } catch (error) {

                console.error(
                    "History Error:",
                    error.response?.data || error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load counselling history."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchHistory();

    }, [navigate]);


    return (

        <div className="ai-history-page">

            <div className="ai-history-container">

                {/* HEADER */}

                <div className="ai-history-header">

                    <div className="ai-history-icon">
                        🤖
                    </div>

                    <div className="ai-history-header-text">

                        <h1>
                            AI Counselling History
                        </h1>

                        <p>
                            View your previous AI counselling
                            sessions and career recommendations.
                        </p>

                    </div>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="ai-history-message">

                        <div className="history-loader">
                            🤖
                        </div>

                        <p>
                            Loading your counselling history...
                        </p>

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="ai-history-error">

                        <div className="history-error-icon">
                            ⚠️
                        </div>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    sessions.length === 0 && (

                        <div className="ai-history-empty">

                            <div className="ai-history-empty-icon">
                                🤖
                            </div>

                            <h2>
                                No Counselling History Yet
                            </h2>

                            <p>
                                You haven't completed an AI
                                counselling session yet.
                                Start your first session to
                                discover suitable career paths.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/ai-counselling")
                                }
                            >
                                Start AI Counselling →
                            </button>

                        </div>

                    )}


                {/* HISTORY */}

                {!loading &&
                    !error &&
                    sessions.length > 0 && (

                        <div className="ai-history-list">

                            {sessions.map((session, index) => (

                                <div
                                    className="ai-history-card"
                                    key={
                                        session.id ||
                                        index
                                    }
                                >

                                    {/* CARD TOP */}

                                    <div className="ai-history-card-top">

                                        <span className="history-session-number">
                                            Session #{sessions.length - index}
                                        </span>

                                        <span className="history-date">

                                            {session.created_at
                                                ? new Date(
                                                    session.created_at
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    }
                                                )
                                                : "Date unavailable"}

                                        </span>

                                    </div>


                                    {/* CAREER */}

                                    <div className="ai-history-career">

                                        <div className="history-career-icon">
                                            🎯
                                        </div>

                                        <div>

                                            <span className="history-career-label">
                                                Recommended Career
                                            </span>

                                            <h2>
                                                {session.recommended_career ||
                                                    "Career Recommendation"}
                                            </h2>

                                        </div>

                                    </div>


                                    {/* ANALYSIS */}

                                    {session.analysis && (

                                        <div className="ai-history-analysis">

                                            <div className="analysis-icon">
                                                🤖
                                            </div>

                                            <div>

                                                <strong>
                                                    AI Analysis
                                                </strong>

                                                <p>
                                                    {session.analysis}
                                                </p>

                                            </div>

                                        </div>

                                    )}


                                    {/* ACTION */}

                                    <div className="ai-history-actions">

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/ai-counselling"
                                                )
                                            }
                                        >
                                            Start New Counselling
                                            <span>→</span>
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}


                {/* BACK */}

                <button
                    className="ai-history-back"
                    onClick={() =>
                        navigate("/student-dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>

            </div>

        </div>

    );

}

export default AICounsellingHistory;
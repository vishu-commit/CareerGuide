import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CounsellingHistory.css";

function CounsellingHistory() {
    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchHistory();
    }, []);

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

            setSessions(
                response.data.sessions || []
            );

        } catch (error) {
            console.log(
                "Counselling History Error:",
                error.response?.data || error
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            setMessage(
                error.response?.data?.message ||
                "Failed to load counselling history."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "Date not available";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    };

    const getBestMatch = (session) => {
        return (
            session.best_match ||
            session.recommended_career ||
            session.recommendations?.[0]?.title ||
            "Career recommendation not available"
        );
    };

    const getMatchPercentage = (session) => {
        if (session.match_percentage !== undefined) {
            return session.match_percentage;
        }

        if (
            session.recommendations &&
            session.recommendations.length > 0
        ) {
            return (
                session.recommendations[0]
                    .match_percentage
            );
        }

        return null;
    };

    if (loading) {
        return (
            <div className="history-page">
                <div className="history-container">
                    <p className="history-loading">
                        Loading your counselling history...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="history-page">

            <div className="history-container">

                {/* HEADER */}
                <div className="history-header">

                    <div>
                        <h1>
                            📋 My Counselling History
                        </h1>

                        <p>
                            View your previous AI career
                            counselling sessions and
                            recommendations.
                        </p>
                    </div>

                    <button
                        className="history-back-button"
                        onClick={() =>
                            navigate("/student-dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                </div>


                {/* MESSAGE */}
                {message && (
                    <div className="history-message">
                        {message}
                    </div>
                )}


                {/* NO HISTORY */}
                {!message &&
                    sessions.length === 0 && (

                    <div className="empty-history">

                        <div className="empty-history-icon">
                            🤖
                        </div>

                        <h2>
                            No Counselling History Yet
                        </h2>

                        <p>
                            You haven't completed any AI
                            counselling sessions yet.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/ai-counselling")
                            }
                        >
                            🤖 Start Free AI Counselling
                        </button>

                    </div>
                )}


                {/* HISTORY LIST */}
                {sessions.length > 0 && (

                    <div className="history-list">

                        {sessions.map(
                            (session, index) => {

                                const matchPercentage =
                                    getMatchPercentage(
                                        session
                                    );

                                return (
                                    <div
                                        className="history-card"
                                        key={
                                            session.id ||
                                            session.sessionId ||
                                            index
                                        }
                                    >

                                        <div className="history-card-top">

                                            <div>
                                                <span className="history-label">
                                                    AI Counselling Session
                                                </span>

                                                <h2>
                                                    🎯{" "}
                                                    {getBestMatch(
                                                        session
                                                    )}
                                                </h2>
                                            </div>

                                            {matchPercentage !==
                                                null && (
                                                <div className="history-match">
                                                    ⭐{" "}
                                                    {matchPercentage}%
                                                    <span>
                                                        Match
                                                    </span>
                                                </div>
                                            )}

                                        </div>


                                        <div className="history-details">

                                            <div>
                                                <span>
                                                    📅 Date
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        session.created_at ||
                                                        session.date ||
                                                        session.createdAt
                                                    )}
                                                </strong>
                                            </div>


                                            <div>
                                                <span>
                                                    🎯 Best Career
                                                </span>

                                                <strong>
                                                    {getBestMatch(
                                                        session
                                                    )}
                                                </strong>
                                            </div>

                                        </div>


                                        {session.analysis && (

                                            <div className="history-analysis">

                                                <h3>
                                                    📝 Analysis
                                                </h3>

                                                <p>
                                                    {session.analysis}
                                                </p>

                                            </div>

                                        )}

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}


                {/* BOTTOM BUTTON */}

                {sessions.length > 0 && (

                    <div className="history-bottom">

                        <button
                            onClick={() =>
                                navigate("/ai-counselling")
                            }
                        >
                            🤖 Start New AI Counselling
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}

export default CounsellingHistory;
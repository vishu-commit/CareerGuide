import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AICounselling.css";

function AICounselling() {

    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);


    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const sendMessage = async () => {

        const text = message.trim();

        if (!text || loading) {
            return;
        }

        setError("");

        const token = localStorage.getItem("token");

        if (!token) {

            setError(
                "Your session has expired. Please login again."
            );

            navigate("/login");

            return;
        }


        // -------------------------------------------------
        // SHOW STUDENT MESSAGE
        // -------------------------------------------------

        setMessages(prev => [
            ...prev,
            {
                role: "user",
                content: text
            }
        ]);

        setMessage("");
        setLoading(true);


        try {

            const response = await api.post(
                "/ai-counselling",
                {
                    message: text
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = response.data;

            console.log(
                "AI Counselling Response:",
                data
            );


            // =================================================
            // FOLLOW-UP QUESTION
            // =================================================

            if (data.needs_follow_up === true) {

                setMessages(prev => [
                    ...prev,
                    {
                        role: "assistant",
                        content:
                            data.follow_up_question ||
                            "Can you tell me a little more about your interests?"
                    }
                ]);

                return;
            }


            // =================================================
            // FINAL CAREER RESULT
            // =================================================

            if (
                data.needs_follow_up === false &&
                data.best_match
            ) {

                setMessages(prev => [
                    ...prev,
                    {
                        role: "assistant",
                        content:
                            "Thanks for sharing! I've analysed your interests and found some career options that may suit you."
                    }
                ]);

                setResult(data);

                return;
            }


            // =================================================
            // UNKNOWN RESPONSE
            // =================================================

            setError(
                "I couldn't understand the counselling response. Please try again."
            );

        } catch (error) {

            console.error(
                "AI Counselling Error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Unable to process your counselling request. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // ENTER KEY
    // =====================================================

    const handleKeyDown = (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();

        }

    };


    // =====================================================
    // START AGAIN
    // =====================================================

    const startAgain = () => {

        setMessage("");
        setMessages([]);
        setResult(null);
        setError("");

    };


    // =====================================================
    // RESULT SCREEN
    // =====================================================

    if (result) {

        const recommendations =
            result.recommendations || [];


        return (

            <div className="ai-counselling-page">

                <div className="ai-counselling-container">


                    {/* =================================================
                       RESULT HEADER
                    ================================================= */}

                    <div className="ai-counselling-header">

                        <div className="ai-robot-icon">
                            🤖
                        </div>

                        <h1>
                            🎯 Your Career Matches
                        </h1>

                        <p>
                            Based on what you shared,
                            here are the career paths
                            that may suit you.
                        </p>

                    </div>


                    {/* =================================================
                       BEST MATCH
                    ================================================= */}

                    {result.best_match && (

                        <div className="ai-best-card">

                            <div className="ai-best-badge">
                                ⭐ BEST MATCH
                            </div>

                            <h2>
                                {result.best_match.title}
                            </h2>

                            <div className="ai-match">
                                {result.best_match.match_percentage}% Match
                            </div>

                            <div className="ai-reason">

                                <strong>
                                    Why this may suit you:
                                </strong>

                                <p>
                                    {result.best_match.reason}
                                </p>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                       OTHER CAREERS
                    ================================================= */}

                    {recommendations.length > 1 && (

                        <div className="ai-other-section">

                            <div className="ai-section-heading-box">

                                <h2 className="ai-section-title">
                                    Other Career Options
                                </h2>

                                <p className="ai-section-subtitle">
                                    These careers also match some of
                                    your interests.
                                </p>

                            </div>


                            <div className="ai-recommendations">

                                {recommendations
                                    .slice(1)
                                    .map((career, index) => (

                                        <div
                                            className="ai-result-card"
                                            key={
                                                career.id ||
                                                career.title ||
                                                index
                                            }
                                        >

                                            <div className="ai-rank">
                                                #{index + 2}
                                            </div>

                                            <div className="ai-result-content">

                                                <h3>
                                                    {career.title}
                                                </h3>

                                                {career.category && (

                                                    <span className="ai-category">
                                                        {career.category}
                                                    </span>

                                                )}

                                                <p>
                                                    {career.reason}
                                                </p>

                                            </div>

                                            <div className="ai-percentage">

                                                {career.match_percentage}%

                                            </div>

                                        </div>

                                    ))}

                            </div>

                        </div>

                    )}


                    {/* =================================================
                       AI ANALYSIS
                    ================================================= */}

                    {result.analysis && (

                        <div className="ai-analysis-box">

                            <div className="ai-analysis-icon">
                                🤖
                            </div>

                            <div className="ai-analysis-content">

                                <h2>
                                    AI Analysis
                                </h2>

                                <p>
                                    {result.analysis}
                                </p>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                       CAREER PLANNING
                    ================================================= */}

                    <div className="ai-planning-box">

                        <h2>
                            🚀 Continue Your Career Planning
                        </h2>

                        <p>
                            Explore courses, colleges,
                            budget options and your
                            personalized career roadmap.
                        </p>

                        <button
                            type="button"
                            className="ai-primary-button"
                            onClick={() =>
                                navigate(
                                    "/student-dashboard",
                                    {
                                        state: {
                                            recommendations
                                        }
                                    }
                                )
                            }
                        >
                            Explore Career Planning →
                        </button>

                    </div>


                    {/* =================================================
                       HUMAN COUNSELLOR
                    ================================================= */}

                    <div className="ai-counsellor-box">

                        <h2>
                            👨‍🏫 Want Personal Guidance?
                        </h2>

                        <p>
                            AI counselling is free.
                            If you want one-to-one personal
                            guidance, you can book a paid
                            consultation with a human counsellor.
                        </p>

                        <button
                            type="button"
                            className="ai-secondary-button"
                            onClick={() =>
                                navigate("/counsellors")
                            }
                        >
                            Talk to a Human Counsellor
                        </button>

                        <small>
                            Paid consultation
                        </small>

                    </div>


                    {/* =================================================
                       RESTART
                    ================================================= */}

                    <button
                        type="button"
                        className="ai-restart-button"
                        onClick={startAgain}
                    >
                        ↻ Start Counselling Again
                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // CHAT SCREEN
    // =====================================================

    return (

        <div className="ai-counselling-page">

            <div className="ai-counselling-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="ai-counselling-header">

                    <div className="ai-robot-icon">
                        🤖
                    </div>

                    <h1>
                        Tell me about yourself
                    </h1>

                    <p>
                        Hi! I'm your AI Career Counsellor.
                        Tell me about yourself and I'll help
                        you discover career options that fit you.
                    </p>

                </div>


                {/* =================================================
                   EXAMPLE BOX
                ================================================= */}

                {messages.length === 0 && (

                    <div className="ai-example-box">

                        <h3>
                            💡 You can tell me things like:
                        </h3>

                        <p>
                            "I'm a BCA final year student.
                            I like coding and designing websites.
                            I know Java and React but I'm confused
                            whether I should go into software
                            development, UI/UX or something else."
                        </p>

                    </div>

                )}


                {/* =================================================
                   CHAT MESSAGES
                ================================================= */}

                {messages.length > 0 && (

                    <div className="ai-chat-box">

                        {messages.map((msg, index) => (

                            <div
                                key={index}
                                className={
                                    msg.role === "user"
                                        ? "ai-chat-message user-message"
                                        : "ai-chat-message ai-message"
                                }
                            >

                                <div className="ai-chat-avatar">

                                    {msg.role === "user"
                                        ? "👤"
                                        : "🤖"}

                                </div>

                                <div className="ai-chat-content">

                                    {msg.content}

                                </div>

                            </div>

                        ))}


                        {/* =================================================
                           TYPING
                        ================================================= */}

                        {loading && (

                            <div className="ai-chat-message ai-message">

                                <div className="ai-chat-avatar">
                                    🤖
                                </div>

                                <div className="ai-chat-content ai-typing">

                                    <span></span>
                                    <span></span>
                                    <span></span>

                                </div>

                            </div>

                        )}

                    </div>

                )}


                {/* =================================================
                   ERROR
                ================================================= */}

                {error && (

                    <div className="ai-error">
                        {error}
                    </div>

                )}


                {/* =================================================
                   INPUT
                ================================================= */}

                <div className="ai-chat-input-container">

                    <textarea
                        className="ai-chat-input"
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Tell me about yourself..."
                        disabled={loading}
                        rows={5}
                    />

                    <div className="ai-input-footer">

                        <span>
                            Press Enter to send
                        </span>

                        <button
                            type="button"
                            className="ai-primary-button"
                            onClick={sendMessage}
                            disabled={
                                loading ||
                                !message.trim()
                            }
                        >

                            {loading
                                ? "Thinking..."
                                : "Send to AI →"}

                        </button>

                    </div>

                </div>


                {/* =================================================
                   FOOTER
                ================================================= */}

                <div className="ai-chat-footer">

                    ✨ You don't need to answer fixed questions.
                    Just describe yourself naturally.

                </div>

            </div>

        </div>

    );

}

export default AICounselling;
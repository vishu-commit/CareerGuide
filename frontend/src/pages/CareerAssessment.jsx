import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CareerAssessment.css";

function CareerAssessment() {

    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const [answers, setAnswers] = useState({
        education: "",
        interests: [],
        work_type: "",
        technology: "",
        creativity: "",
        business: "",
        people: "",
        practical: "",
        problem_solving: ""
    });


    // =====================================================
    // SINGLE ANSWER
    // =====================================================

    const handleChange = (field, value) => {

        setAnswers(prev => ({
            ...prev,
            [field]: value
        }));

    };


    // =====================================================
    // MULTIPLE ANSWERS
    // =====================================================

    const handleMultiple = (field, value) => {

        setAnswers(prev => {

            const current = prev[field];

            if (current.includes(value)) {

                return {
                    ...prev,
                    [field]: current.filter(
                        item => item !== value
                    )
                };

            }

            return {
                ...prev,
                [field]: [...current, value]
            };

        });

    };


    // =====================================================
    // NEXT
    // =====================================================

    const nextStep = () => {

        setError("");

        if (step === 1 && !answers.education) {
            setError("Please select your education.");
            return;
        }

        if (
            step === 2 &&
            answers.interests.length === 0
        ) {
            setError("Please select at least one interest.");
            return;
        }

        if (step === 3 && !answers.work_type) {
            setError("Please select your preferred work type.");
            return;
        }

        if (step === 4 && !answers.technology) {
            setError("Please select an option.");
            return;
        }

        if (step === 5 && !answers.creativity) {
            setError("Please select an option.");
            return;
        }

        if (step === 6 && !answers.business) {
            setError("Please select an option.");
            return;
        }

        if (step === 7 && !answers.people) {
            setError("Please select an option.");
            return;
        }

        if (step === 8 && !answers.practical) {
            setError("Please select an option.");
            return;
        }

        if (
            step === 9 &&
            !answers.problem_solving
        ) {
            setError("Please select an option.");
            return;
        }

        setStep(prev => prev + 1);

    };


    // =====================================================
    // BACK
    // =====================================================

    const previousStep = () => {

        setError("");

        setStep(prev => prev - 1);

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const submitAssessment = async () => {

        setLoading(true);
        setError("");

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {

                navigate("/login");

                return;

            }


            const response = await api.post(
                "/ai-counselling",
                {
                    answers
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            console.log(
                "Career Assessment Result:",
                response.data
            );


            setResult(response.data);

        } catch (error) {

            console.error(
                "Assessment Error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Unable to complete career assessment."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // RESTART
    // =====================================================

    const restartAssessment = () => {

        setStep(1);
        setResult(null);
        setError("");

        setAnswers({
            education: "",
            interests: [],
            work_type: "",
            technology: "",
            creativity: "",
            business: "",
            people: "",
            practical: "",
            problem_solving: ""
        });

    };


    // =====================================================
    // RESULT
    // =====================================================

    if (result) {

        const recommendations =
            result.recommendations || [];

        return (

            <div className="assessment-page">

                <div className="assessment-result-container">

                    <div className="assessment-result-header">

                        <div className="assessment-result-icon">
                            🎯
                        </div>

                        <h1>
                            Your Career Assessment Result
                        </h1>

                        <p>
                            Based on your interests,
                            preferences and responses,
                            these career paths may suit you.
                        </p>

                    </div>


                    {/* BEST MATCH */}

                    {result.best_match && (

                        <div className="assessment-best-card">

                            <div className="assessment-best-badge">
                                ⭐ BEST MATCH
                            </div>

                            <h2>
                                {result.best_match.title}
                            </h2>

                            <div className="assessment-match">

                                {result.best_match.match_percentage}%
                                Match

                            </div>

                            <p>

                                <strong>
                                    Why this career?
                                </strong>

                            </p>

                            <p>
                                {result.best_match.reason}
                            </p>


                            {result.best_match.description && (

                                <p>
                                    {result.best_match.description}
                                </p>

                            )}

                        </div>

                    )}


                    {/* OTHER CAREERS */}

                    {recommendations.length > 1 && (

                        <div className="assessment-other">

                            <h2>
                                Other Career Options
                            </h2>

                            <p className="assessment-subtitle">
                                These careers also match your profile.
                            </p>


                            <div className="assessment-careers">

                                {recommendations
                                    .slice(1)
                                    .map((career, index) => (

                                        <div
                                            className="assessment-career-card"
                                            key={
                                                career.id ||
                                                career.title ||
                                                index
                                            }
                                        >

                                            <div className="assessment-rank">
                                                #{index + 2}
                                            </div>


                                            <div className="assessment-career-info">

                                                <h3>
                                                    {career.title}
                                                </h3>

                                                <span>
                                                    {career.category}
                                                </span>

                                                <p>
                                                    {career.reason}
                                                </p>

                                            </div>


                                            <div className="assessment-percent">

                                                {career.match_percentage}%

                                            </div>

                                        </div>

                                    ))}

                            </div>

                        </div>

                    )}


                    {/* ANALYSIS */}

                    {result.analysis && (

                        <div className="assessment-analysis">

                            <h2>
                                🤖 Career Analysis
                            </h2>

                            <p>
                                {result.analysis}
                            </p>

                        </div>

                    )}


                    {/* CONTINUE */}

                    <div className="assessment-planning">

                        <h2>
                            🚀 Continue Your Career Planning
                        </h2>

                        <p>
                            Explore courses, colleges,
                            budget options and your
                            personalized career roadmap.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/student-dashboard"
                                )
                            }
                        >
                            Explore Career Planning →
                        </button>

                    </div>


                    {/* HUMAN COUNSELLOR */}

                    <div className="assessment-counsellor">

                        <h2>
                            👨‍🏫 Still Confused?
                        </h2>

                        <p>
                            If you want personal guidance,
                            you can book a paid consultation
                            with a human counsellor.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/counsellors")
                            }
                        >
                            Talk to a Human Counsellor
                        </button>

                    </div>


                    {/* RESTART */}

                    <button
                        className="assessment-restart"
                        onClick={restartAssessment}
                    >
                        ↻ Take Assessment Again
                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // QUESTIONS
    // =====================================================

    return (

        <div className="assessment-page">

            <div className="assessment-container">


                {/* HEADER */}

                <div className="assessment-header">

                    <div className="assessment-icon">
                        🎯
                    </div>

                    <h1>
                        Career Assessment
                    </h1>

                    <p>
                        Answer a few simple questions
                        and discover career paths that
                        may suit you.
                    </p>

                </div>


                {/* PROGRESS */}

                <div className="assessment-progress">

                    <div
                        className="assessment-progress-bar"
                        style={{
                            width:
                                `${(step / 9) * 100}%`
                        }}
                    />

                </div>

                <p className="assessment-step">
                    Question {step} of 9
                </p>


                {/* ERROR */}

                {error && (

                    <div className="assessment-error">
                        {error}
                    </div>

                )}


                {/* QUESTION 1 */}

                {step === 1 && (

                    <Question
                        title="What is your current education?"
                    >

                        {[
                            "10th",
                            "12th",
                            "Diploma",
                            "Graduation",
                            "Post Graduation"
                        ].map(option => (

                            <Option
                                key={option}
                                text={option}
                                selected={
                                    answers.education === option
                                }
                                onClick={() =>
                                    handleChange(
                                        "education",
                                        option
                                    )
                                }
                            />

                        ))}

                    </Question>

                )}


                {/* QUESTION 2 */}

                {step === 2 && (

                    <Question
                        title="Which areas interest you?"
                        subtitle="You can select multiple."
                    >

                        {[
                            "Technology",
                            "Coding",
                            "Mathematics",
                            "Science",
                            "Business",
                            "Art",
                            "Design",
                            "Fashion",
                            "Beauty",
                            "Communication",
                            "Teaching",
                            "Sports",
                            "Food",
                            "Travel",
                            "Media",
                            "Creativity"
                        ].map(option => (

                            <Option
                                key={option}
                                text={option}
                                selected={
                                    answers.interests.includes(
                                        option
                                    )
                                }
                                onClick={() =>
                                    handleMultiple(
                                        "interests",
                                        option
                                    )
                                }
                            />

                        ))}

                    </Question>

                )}


                {/* QUESTION 3 */}

                {step === 3 && (

                    <Question
                        title="What type of work do you prefer?"
                    >

                        {[
                            "Creative work",
                            "Technology work",
                            "Business work",
                            "Helping people",
                            "Practical / hands-on work",
                            "Research / analytical work"
                        ].map(option => (

                            <Option
                                key={option}
                                text={option}
                                selected={
                                    answers.work_type === option
                                }
                                onClick={() =>
                                    handleChange(
                                        "work_type",
                                        option
                                    )
                                }
                            />

                        ))}

                    </Question>

                )}


                {/* QUESTION 4 */}

                {step === 4 && (

                    <Question
                        title="How interested are you in technology?"
                    >

                        {[
                            "Very Interested",
                            "Interested",
                            "Neutral",
                            "Less Interested",
                            "Not Interested"
                        ].map(option => (

                            <Option
                                key={option}
                                text={option}
                                selected={
                                    answers.technology === option
                                }
                                onClick={() =>
                                    handleChange(
                                        "technology",
                                        option
                                    )
                                }
                            />

                        ))}

                    </Question>

                )}


                {/* QUESTION 5 */}

                {step === 5 && (

                    <Question
                        title="How creative do you consider yourself?"
                    >

                        {[
                            "Very Creative",
                            "Creative",
                            "Moderately Creative",
                            "Less Creative",
                            "Not Sure"
                        ].map(option => (

                            <Option
                                key={option}
                                text={option}
                                selected={
                                    answers.creativity === option
                                }
                                onClick={() =>
                                    handleChange(
                                        "creativity",
                                        option
                                    )
                                }
                            />

                        ))}

                    </Question>

                )}


                {/* QUESTION 6 */}

                {step === 6 && (

                    <Question
                        title="How interested are you in business or entrepreneurship?"
                    >

                        {[
                            "Very Interested",
                            "Interested",
                            "Neutral",
                            "Less Interested",
                            "Not Interested"
                        ].map(option => (

                            <Option
                                key={option}
                                text={option}
                                selected={
                                    answers.business === option
                                }
                                onClick={() =>
                                    handleChange(
                                        "business",
                                        option
                                    )
                                }
                            />

                        ))}

                    </Question>

                )}


                {/* QUESTION 7 */}

                {step === 7 && (

                    <Question
                        title="How comfortable are you working with people?"
                    >

                        {[
                            "Very Comfortable",
                            "Comfortable",
                            "Neutral",
                            "Not Comfortable"
                        ].map(option => (

                            <Option
                                key={option}
                                text={option}
                                selected={
                                    answers.people === option
                                }
                                onClick={() =>
                                    handleChange(
                                        "people",
                                        option
                                    )
                                }
                            />

                        ))}

                    </Question>

                )}


                {/* QUESTION 8 */}

                {step === 8 && (

                    <Question
                        title="How interested are you in practical / skill-based work?"
                    >

                        {[
                            "Very Interested",
                            "Interested",
                            "Neutral",
                            "Less Interested",
                            "Not Interested"
                        ].map(option => (

                            <Option
                                key={option}
                                text={option}
                                selected={
                                    answers.practical === option
                                }
                                onClick={() =>
                                    handleChange(
                                        "practical",
                                        option
                                    )
                                }
                            />

                        ))}

                    </Question>

                )}


                {/* QUESTION 9 */}

                {step === 9 && (

                    <Question
                        title="How do you feel about problem solving?"
                    >

                        {[
                            "Love it",
                            "Like it",
                            "Neutral",
                            "Don't like it"
                        ].map(option => (

                            <Option
                                key={option}
                                text={option}
                                selected={
                                    answers.problem_solving === option
                                }
                                onClick={() =>
                                    handleChange(
                                        "problem_solving",
                                        option
                                    )
                                }
                            />

                        ))}

                    </Question>

                )}


                {/* BUTTONS */}

                <div className="assessment-buttons">

                    {step > 1 && (

                        <button
                            className="assessment-back"
                            onClick={previousStep}
                        >
                            ← Back
                        </button>

                    )}


                    {step < 9 ? (

                        <button
                            className="assessment-next"
                            onClick={nextStep}
                        >
                            Next →
                        </button>

                    ) : (

                        <button
                            className="assessment-next"
                            onClick={submitAssessment}
                            disabled={loading}
                        >

                            {loading
                                ? "Analysing..."
                                : "🎯 Get My Career Matches"
                            }

                        </button>

                    )}

                </div>


                <div className="assessment-note">
                    ✨ This assessment is completely free.
                </div>

            </div>

        </div>

    );

}


// =====================================================
// QUESTION COMPONENT
// =====================================================

function Question({
    title,
    subtitle,
    children
}) {

    return (

        <div className="assessment-question">

            <h2>
                {title}
            </h2>

            {subtitle && (

                <p>
                    {subtitle}
                </p>

            )}

            <div className="assessment-options">
                {children}
            </div>

        </div>

    );

}


// =====================================================
// OPTION COMPONENT
// =====================================================

function Option({
    text,
    selected,
    onClick
}) {

    return (

        <button
            type="button"
            className={
                `assessment-option ${
                    selected ? "selected" : ""
                }`
            }
            onClick={onClick}
        >

            <span>
                {selected ? "✓" : "○"}
            </span>

            {text}

        </button>

    );

}


export default CareerAssessment;
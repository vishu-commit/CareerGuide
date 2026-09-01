import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "./Colleges.css";

function Colleges() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const careerId = searchParams.get("career");

    const [career, setCareer] = useState(null);

    const [city, setCity] = useState("");
    const [maxFee, setMaxFee] = useState("");

    const [colleges, setColleges] = useState([]);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    /* =========================================
       FETCH CAREER
    ========================================= */

    useEffect(() => {

        const fetchCareer = async () => {

            if (!careerId) {
                setCareer(null);
                return;
            }

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {

                const response = await api.get(
                    `/careers/${careerId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setCareer(response.data.career);

            } catch (error) {

                console.log(
                    "Career Error:",
                    error.response?.data || error
                );

                setCareer(null);
            }
        };

        fetchCareer();

    }, [careerId, navigate]);


    /* =========================================
       FIND COLLEGES
    ========================================= */

    const handleSearch = async (e) => {

        e.preventDefault();

        if (!careerId) {

            setMessage(
                "Please select a career first."
            );

            return;
        }

        if (!city.trim()) {

            setMessage(
                "Please enter a city."
            );

            return;
        }

        if (!maxFee) {

            setMessage(
                "Please enter maximum annual fee."
            );

            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            setLoading(true);
            setMessage("");
            setColleges([]);

            const response = await api.get(
                "/colleges",
                {
                    params: {
                        course:
                            career?.title
                                ?.toLowerCase()
                                .includes("software")
                                ? "Computer Science"
                                : career?.title
                                    ?.toLowerCase()
                                    .includes("data")
                                    ? "Data Science"
                                    : career?.title
                                        ?.toLowerCase()
                                        .includes("ui")
                                        ? "UI/UX Design"
                                        : "",
                        city: city.trim(),
                        maxFee: maxFee
                    },

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const result =
                response.data.colleges || [];

            setColleges(result);

            if (result.length === 0) {

                setMessage(
                    "No colleges found for your selected city and budget."
                );
            }

        } catch (error) {

            console.log(
                "College Error:",
                error.response?.data || error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to find colleges."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="colleges-page">

            <div className="colleges-content">


                {/* =========================================
                   BACK BUTTON
                ========================================= */}

                <button
                    className="colleges-back-button"
                    onClick={() => {

                        if (careerId) {

                            navigate(
                                `/careers/${careerId}`
                            );

                        } else {

                            navigate("/careers");

                        }

                    }}
                >
                    ← Back to Career
                </button>


                {/* =========================================
                   HERO
                ========================================= */}

                <div className="colleges-hero">

                    <div className="college-hero-icon">
                        🏫
                    </div>

                    <div>

                        <h1>
                            Find the Right College
                        </h1>

                        <p>
                            Explore colleges based on your
                            career, location and budget.
                        </p>

                    </div>

                </div>


                {/* =========================================
                   SELECTED CAREER
                ========================================= */}

                <div className="selected-career-box">

                    <div className="selected-career-left">

                        <span className="career-small-icon">
                            🎯
                        </span>

                        <div>

                            <span className="selected-label">
                                Selected Career
                            </span>

                            <h2>
                                {career
                                    ? career.title
                                    : "No career selected"
                                }
                            </h2>

                        </div>

                    </div>

                    {career && (
                        <span className="career-selected-badge">
                            ✓ Selected
                        </span>
                    )}

                </div>


                {/* =========================================
                   SEARCH SECTION
                ========================================= */}

                <div className="college-search-card">

                    <div className="search-heading">

                        <div className="search-heading-icon">
                            🔍
                        </div>

                        <div>

                            <h2>
                                Search Colleges
                            </h2>

                            <p>
                                Set your preferred city and
                                maximum annual fee to find
                                suitable colleges.
                            </p>

                        </div>

                    </div>


                    <form
                        className="college-search-form"
                        onSubmit={handleSearch}
                    >

                        <div className="college-input-group">

                            <label>
                                📍 City
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. Delhi"
                                value={city}
                                onChange={(e) =>
                                    setCity(e.target.value)
                                }
                            />

                        </div>


                        <div className="college-input-group">

                            <label>
                                💰 Maximum Annual Fee
                            </label>

                            <input
                                type="number"
                                placeholder="e.g. 150000"
                                value={maxFee}
                                onChange={(e) =>
                                    setMaxFee(e.target.value)
                                }
                            />

                        </div>


                        <button
                            className="find-college-button"
                            type="submit"
                            disabled={loading || !career}
                        >

                            {loading
                                ? "Searching..."
                                : "🔍 Find Colleges"
                            }

                        </button>

                    </form>


                    {message && (

                        <div className="college-message">
                            {message}
                        </div>

                    )}

                </div>


                {/* =========================================
                   COLLEGE RESULTS
                ========================================= */}

                {colleges.length > 0 && (

                    <div className="college-results">

                        <div className="results-header">

                            <div>

                                <h2>
                                    🏫 Recommended Colleges
                                </h2>

                                <p>
                                    Colleges matching your
                                    selected career and preferences.
                                </p>

                            </div>

                            <span>
                                {colleges.length} Found
                            </span>

                        </div>


                        <div className="college-grid">

                            {colleges.map((college) => (

                                <div
                                    className="college-card"
                                    key={college.id}
                                >

                                    <div className="college-card-icon">
                                        🏫
                                    </div>


                                    <h2>
                                        {college.college_name}
                                    </h2>


                                    <div className="college-location">
                                        📍 {college.city}, {college.state}
                                    </div>


                                    <div className="college-info">

                                        <div>
                                            <span>
                                                Course
                                            </span>

                                            <strong>
                                                {college.course}
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Annual Fee
                                            </span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    college.annual_fee
                                                ).toLocaleString("en-IN")}
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Rating
                                            </span>

                                            <strong>
                                                ⭐ {college.rating}
                                            </strong>
                                        </div>

                                    </div>


                                    {college.description && (

                                        <p className="college-description">
                                            {college.description}
                                        </p>

                                    )}

                                </div>

                            ))}

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Colleges;
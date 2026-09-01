import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./Roadmap.css";

function Roadmap() {

    const { careerId } = useParams();
    const navigate = useNavigate();

    const [roadmap, setRoadmap] = useState([]);
    const [career, setCareer] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);


    // =========================================
    // FETCH ROADMAP
    // =========================================

    useEffect(() => {

        const fetchRoadmap = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {

                setLoading(true);

                const response = await api.get(
                    `/roadmaps/${careerId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const roadmapData =
                    response.data.roadmap || [];

                setRoadmap(roadmapData);

                /*
                    Career information roadmap response
                    mein available ho to use karenge.
                */

                if (roadmapData.length > 0) {

                    setCareer({
                        title:
                            roadmapData[0].career_title ||
                            roadmapData[0].career_name ||
                            "Career"
                    });

                }

            } catch (error) {

                console.log(
                    "Roadmap Error:",
                    error.response?.data || error
                );

                setRoadmap([]);

                setMessage(
                    error.response?.data?.message ||
                    "Failed to load career roadmap"
                );

            } finally {

                setLoading(false);

            }

        };

        if (careerId) {
            fetchRoadmap();
        }

    }, [careerId, navigate]);


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div className="roadmap-page">

                <div className="roadmap-header">

                    <h1>
                        🗺️ Career Roadmap
                    </h1>

                    <p>
                        Loading your career roadmap...
                    </p>

                </div>

            </div>
        );

    }


    // =========================================
    // UI
    // =========================================

    return (

        <div className="roadmap-page">

            {/* HEADER */}

            <div className="roadmap-header">

                <h1>
                    🗺️ Career Roadmap
                </h1>

                <p>
                    Follow these steps to build your career
                    step by step.
                </p>

            </div>


            {/* BACK BUTTON */}

            <button
                className="view-roadmap-button"
                onClick={() =>
                    navigate("/student-dashboard")
                }
            >
                ← Back to Dashboard
            </button>


            {/* MESSAGE */}

            {message && (

                <div className="roadmap-empty">

                    {message}

                </div>

            )}


            {/* ROADMAP */}

            {!message && roadmap.length > 0 && (

                <div className="roadmap-steps">

                    {roadmap.map((step, index) => (

                        <div
                            className="roadmap-step"
                            key={step.id || index}
                        >

                            <h3>

                                Step{" "}

                                {step.step_number ||
                                    index + 1}

                                :{" "}

                                {step.title}

                            </h3>


                            <p>

                                {step.description}

                            </p>

                        </div>

                    ))}

                </div>

            )}


            {/* NO ROADMAP */}

            {!message && roadmap.length === 0 && (

                <div className="roadmap-empty">

                    <h3>
                        Roadmap Not Available
                    </h3>

                    <p>
                        Career roadmap is not available
                        for this career yet.
                    </p>

                </div>

            )}

        </div>

    );

}

export default Roadmap;
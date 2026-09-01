import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Counsellors.css";

function Counsellors() {
    const [counsellors, setCounsellors] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCounsellors = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await api.get("/counsellors", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setCounsellors(response.data.counsellors);
            } catch (error) {
                console.log(error);

                setMessage(
                    error.response?.data?.message ||
                    "Failed to load counsellors"
                );
            }
        };

        fetchCounsellors();
    }, [navigate]);

    return (
        <div className="counsellor-page">

            <nav className="navbar">
                <h2>CareerGuide</h2>

                <button onClick={() => navigate("/dashboard")}>
                    Dashboard
                </button>
            </nav>

            <main className="counsellor-content">

                <h1>Find a Counsellor</h1>

                <p className="subtitle">
                    Connect with experienced counsellors
                    and get personalised career guidance.
                </p>

                {message && (
                    <p className="message">
                        {message}
                    </p>
                )}

                <div className="counsellor-grid">

                    {counsellors.map((counsellor) => (
                        <div
                            className="counsellor-card"
                            key={counsellor.id}
                        >

                            <div className="avatar">
                                {counsellor.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>

                            <h2>
                                {counsellor.name}
                            </h2>

                            <h4>
                                {counsellor.specialization}
                            </h4>

                            <p>
                                {counsellor.bio}
                            </p>

                            <div className="experience">
                                ⭐ {counsellor.experience} years
                                experience
                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/counsellors/${counsellor.id}`
                                    )
                                }
                            >
                                View Profile
                            </button>

                        </div>
                    ))}

                </div>

            </main>
        </div>
    );
}

export default Counsellors;
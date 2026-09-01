import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./CounsellorProfile.css";

function CounsellorProfile() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [counsellor, setCounsellor] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {

        const fetchData = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`
            };

            // =====================================
            // GET COUNSELLOR
            // =====================================

            try {

                const response = await api.get(
                    `/counsellors/${id}`,
                    { headers }
                );

                setCounsellor(
                    response.data.counsellor
                );

            } catch (error) {

                console.log(
                    "Counsellor Error:",
                    error.response?.data || error
                );

                setMessage(
                    error.response?.data?.message ||
                    "Failed to load counsellor"
                );

                return;
            }


            // =====================================
            // GET AVAILABILITY
            // =====================================

            try {

                const response = await api.get(
                    `/counsellors/${id}/availability`,
                    { headers }
                );

                setAvailability(
                    response.data.availability || []
                );

            } catch (error) {

                console.log(
                    "Availability Error:",
                    error.response?.data || error
                );

                setAvailability([]);
            }
        };

        fetchData();

    }, [id, navigate]);


    // =====================================
    // LOADING
    // =====================================

    if (!counsellor && !message) {

        return (
            <div className="counsellor-profile-loading">

                <div className="loading-spinner">
                    ⏳
                </div>

                <h2>
                    Loading Counsellor...
                </h2>

                <p>
                    Please wait while we load the profile.
                </p>

            </div>
        );
    }


    // =====================================
    // ERROR
    // =====================================

    if (message) {

        return (
            <div className="counsellor-profile-error">

                <div className="error-icon">
                    ⚠️
                </div>

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {message}
                </p>

                <button
                    onClick={() =>
                        navigate("/counsellors")
                    }
                >
                    ← Back to Counsellors
                </button>

            </div>
        );
    }


    // =====================================
    // BOOK SLOT
    // =====================================
const handleBook = (slot) => {

    const date = new Date(slot.available_date);

    const appointmentDate =
        date.toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata"
        });

    navigate(
        `/counsellors/${counsellor.id}/book`,
        {
            state: {
                appointmentDate: appointmentDate,
                appointmentTime: slot.start_time
            }
        }
    );
};
    


    return (

        <div className="cg-counsellor-page">

            {/* =====================================
                TOP BAR
            ===================================== */}

            <div className="cg-counsellor-topbar">

                <div className="cg-brand">

                    <div className="cg-brand-icon">
                        🎯
                    </div>

                    <div>
                        <h2>
                            CareerGuide
                        </h2>

                        <span>
                            Student Portal
                        </span>
                    </div>

                </div>

                <button
                    className="cg-back-button"
                    onClick={() =>
                        navigate("/counsellors")
                    }
                >
                    ← Back to Counsellors
                </button>

            </div>


            {/* =====================================
                MAIN CONTAINER
            ===================================== */}

            <main className="cg-counsellor-container">


                {/* =====================================
                    PROFILE HEADER
                ===================================== */}

                <section className="cg-profile-header">

                    <div className="cg-avatar">

                        {counsellor.name
                            ?.charAt(0)
                            .toUpperCase()}

                    </div>

                    <div className="cg-profile-heading">

                        <h1>
                            {counsellor.name}
                        </h1>

                        <div className="cg-specialization">
                            {counsellor.specialization}
                        </div>

                        <p>
                            {counsellor.bio}
                        </p>

                    </div>

                </section>


                {/* =====================================
                    INFORMATION CARDS
                ===================================== */}

                <section className="cg-info-grid">

                    {/* EXPERIENCE */}

                    <div className="cg-info-card">

                        <div className="cg-info-icon">
                            💼
                        </div>

                        <div>

                            <span>
                                Experience
                            </span>

                            <strong>
                                {counsellor.experience} Years
                            </strong>

                        </div>

                    </div>


                    {/* EMAIL */}

                    <div className="cg-info-card">

                        <div className="cg-info-icon">
                            📧
                        </div>

                        <div>

                            <span>
                                Email
                            </span>

                            <strong className="cg-email">
                                {counsellor.email}
                            </strong>

                        </div>

                    </div>


                    {/* SPECIALIZATION */}

                    <div className="cg-info-card">

                        <div className="cg-info-icon">
                            🎯
                        </div>

                        <div>

                            <span>
                                Specialization
                            </span>

                            <strong>
                                {counsellor.specialization}
                            </strong>

                        </div>

                    </div>


                    {/* =====================================
                        CONSULTATION FEE
                    ===================================== */}

                    <div className="cg-info-card">

                        <div className="cg-info-icon">
                            💰
                        </div>

                        <div>

                            <span>
                                Consultation Fee
                            </span>

                            <strong>
                                ₹{counsellor.consultation_fee || "500.00"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =====================================
                    AVAILABILITY
                ===================================== */}

                <section className="cg-availability-section">

                    <div className="cg-section-heading">

                        <div className="cg-section-icon">
                            📅
                        </div>

                        <div>

                            <h2>
                                Available Appointment Slots
                            </h2>

                            <p>
                                Choose a convenient date and time
                                for your counselling session.
                            </p>

                        </div>

                    </div>


                    {availability.length === 0 ? (

                        <div className="cg-no-slots">

                            <div>
                                📭
                            </div>

                            <h3>
                                No Available Slots
                            </h3>

                            <p>
                                This counsellor currently has
                                no available appointment slots.
                            </p>

                        </div>

                    ) : (

                        <div className="cg-slots-grid">

                            {availability.map((slot) => (

                                <div
                                    className="cg-slot-card"
                                    key={slot.id}
                                >

                                    <div className="cg-slot-top">

                                        <span className="cg-calendar-icon">
                                            📅
                                        </span>

                                        <span>
                                            Available
                                        </span>

                                    </div>


                                    <h3>
    {new Date(slot.available_date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Kolkata"
        }
    )}
</h3>


                                    <div className="cg-slot-time">

                                        <span>
                                            ⏰
                                        </span>

                                        <span>
                                            {slot.start_time}
                                            {" - "}
                                            {slot.end_time}
                                        </span>

                                    </div>


                                    <button
                                        className="cg-book-slot-button"
                                        onClick={() =>
                                            handleBook(slot)
                                        }
                                    >
                                        Book This Slot →
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* =====================================
                    BOTTOM BOOK BUTTON
                ===================================== */}

                <div className="cg-bottom-action">

                    <button
                        className="cg-main-book-button"
                        onClick={() =>
                            navigate(
                                `/counsellors/${counsellor.id}/book`
                            )
                        }
                    >
                        📅 Book Appointment
                    </button>

                </div>

            </main>

        </div>
    );
}

export default CounsellorProfile;
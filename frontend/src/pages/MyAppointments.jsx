
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./MyAppointments.css";


function MyAppointments() {

    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();


    // =====================================================
    // FETCH APPOINTMENTS
    // =====================================================

    useEffect(() => {

        const fetchAppointments = async () => {

            const token =
                localStorage.getItem("token");


            // =================================================
            // LOGIN CHECK
            // =================================================

            if (!token) {

                navigate("/login");

                return;

            }


            try {

                const response = await api.get(
                    "/appointments/student",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                setAppointments(
                    response.data.appointments || []
                );


            } catch (error) {

                console.log(
                    "Appointments Error:",
                    error.response?.data || error
                );


                setMessage(
                    error.response?.data?.message ||
                    "Failed to load appointments"
                );

            }

        };


        fetchAppointments();

    }, [navigate]);


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (value) => {

        if (!value) {

            return "N/A";

        }


        // =================================================
        // YYYY-MM-DD
        // =================================================

        if (
            typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}/.test(value)
        ) {

            const datePart =
                value.substring(0, 10);


            const [
                year,
                month,
                day
            ] =
                datePart.split("-");


            const date = new Date(
                Number(year),
                Number(month) - 1,
                Number(day)
            );


            return date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            );

        }


        // =================================================
        // OTHER DATE FORMAT
        // =================================================

        const date = new Date(value);


        if (isNaN(date.getTime())) {

            return "N/A";

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    };


    // =====================================================
    // FORMAT TIME
    // =====================================================

    const formatTime = (value) => {

        if (!value) {

            return "N/A";

        }


        const parts =
            String(value).split(":");


        if (parts.length >= 2) {

            let hour =
                Number(parts[0]);


            const minute =
                parts[1];


            const period =
                hour >= 12
                    ? "PM"
                    : "AM";


            hour =
                hour % 12 || 12;


            return `${hour}:${minute} ${period}`;

        }


        return value;

    };


    // =====================================================
    // FORMAT STATUS
    // =====================================================

    const formatStatus = (status) => {

        if (!status) {

            return "Unknown";

        }


        const text =
            String(status);


        return (
            text.charAt(0).toUpperCase() +
            text.slice(1)
        );

    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        return String(
            status || ""
        ).toLowerCase();

    };


    // =====================================================
    // VIEW COUNSELLOR
    // =====================================================

    const handleViewCounsellor = (
        counsellorId
    ) => {

        navigate(
            `/counsellors/${counsellorId}`
        );

    };


    // =====================================================
    // FIND COUNSELLOR
    // =====================================================

    const handleFindCounsellor = () => {

        navigate("/counsellors");

    };


    // =====================================================
    // JOIN MEETING
    // =====================================================

    const handleJoinMeeting = (
        meetingLink
    ) => {

        if (!meetingLink) {

            alert(
                "Meeting link is not available yet."
            );

            return;

        }


        window.open(
            meetingLink,
            "_blank",
            "noopener,noreferrer"
        );

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="appointments-page">

            <main className="appointments-content">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="appointments-header">

                    <div>

                        <h1>
                            📅 My Appointments
                        </h1>

                        <p>
                            View and manage your career
                            counselling appointments.
                        </p>

                    </div>


                    <button
                        className="find-counsellor-button"
                        onClick={
                            handleFindCounsellor
                        }
                    >

                        👨‍🏫 Find Counsellor

                    </button>

                </div>


                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                {message && (

                    <div className="appointment-error">

                        ⚠️ {message}

                    </div>

                )}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {appointments.length === 0 &&
                    !message ? (

                    <div className="empty-box">

                        <div className="empty-icon">
                            📅
                        </div>


                        <h2>
                            No Appointments Yet
                        </h2>


                        <p>
                            You haven't booked any
                            counselling appointments yet.
                        </p>


                        <button
                            onClick={
                                handleFindCounsellor
                            }
                        >

                            Find a Counsellor

                        </button>

                    </div>

                ) : (


                    /* =================================================
                       APPOINTMENTS LIST
                    ================================================= */

                    <div className="appointments-list">


                        {appointments.map(
                            (appointment) => (

                                <div
                                    className="appointment-card"
                                    key={
                                        appointment.id
                                    }
                                >


                                    {/* =================================================
                                       TOP SECTION
                                    ================================================= */}

                                    <div className="appointment-card-top">


                                        <div className="counsellor-icon">

                                            👨‍🏫

                                        </div>


                                        <div className="counsellor-info">

                                            <h2>

                                                {
                                                    appointment.counsellor_name ||
                                                    "Counsellor"
                                                }

                                            </h2>


                                            <p className="specialization">

                                                {
                                                    appointment.specialization ||
                                                    "Career Counselling"
                                                }

                                            </p>


                                            {appointment.experience && (

                                                <p className="experience">

                                                    ⭐ {
                                                        appointment.experience
                                                    } years experience

                                                </p>

                                            )}

                                        </div>


                                        {/* STATUS */}

                                        <span
                                            className={`status ${getStatusClass(
                                                appointment.status
                                            )}`}
                                        >

                                            {
                                                formatStatus(
                                                    appointment.status
                                                )
                                            }

                                        </span>


                                    </div>


                                    {/* =================================================
                                       DETAILS
                                    ================================================= */}

                                    <div className="appointment-details">


                                        {/* DATE */}

                                        <div className="detail-item">

                                            <span className="detail-icon">
                                                📅
                                            </span>


                                            <div>

                                                <span className="detail-label">
                                                    Date
                                                </span>


                                                <strong>

                                                    {
                                                        formatDate(
                                                            appointment.appointment_date
                                                        )
                                                    }

                                                </strong>

                                            </div>

                                        </div>


                                        {/* TIME */}

                                        <div className="detail-item">

                                            <span className="detail-icon">
                                                ⏰
                                            </span>


                                            <div>

                                                <span className="detail-label">
                                                    Time
                                                </span>


                                                <strong>

                                                    {
                                                        formatTime(
                                                            appointment.appointment_time
                                                        )
                                                    }

                                                </strong>

                                            </div>

                                        </div>


                                        {/* EMAIL */}

                                        <div className="detail-item">

                                            <span className="detail-icon">
                                                ✉️
                                            </span>


                                            <div>

                                                <span className="detail-label">
                                                    Email
                                                </span>


                                                <strong className="email-text">

                                                    {
                                                        appointment.counsellor_email ||
                                                        "N/A"
                                                    }

                                                </strong>

                                            </div>

                                        </div>


                                        {/* FEE */}

                                        <div className="detail-item">

                                            <span className="detail-icon">
                                                💰
                                            </span>


                                            <div>

                                                <span className="detail-label">
                                                    Consultation Fee
                                                </span>


                                                <strong>

                                                    ₹{
                                                        appointment.consultation_fee ||
                                                        500
                                                    }

                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================================
                                       MEETING SECTION
                                    ================================================= */}

                                    {appointment.status === "approved" && (

                                        <div className="meeting-section">

                                            {appointment.meeting_link ? (

                                                <>

                                                    <div className="meeting-info">

                                                        <span className="meeting-icon">
                                                            🎥
                                                        </span>


                                                        <div>

                                                            <strong>
                                                                Online Counselling
                                                            </strong>

                                                            <p>
                                                                Your counsellor has
                                                                added a meeting link.
                                                                You can join your
                                                                counselling session
                                                                from here.
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <button
                                                        className="join-meeting-button"
                                                        onClick={() =>
                                                            handleJoinMeeting(
                                                                appointment.meeting_link
                                                            )
                                                        }
                                                    >

                                                        🎥 Join Meeting

                                                    </button>

                                                </>

                                            ) : (

                                                <div className="meeting-pending">

                                                    <span className="meeting-pending-icon">
                                                        ⏳
                                                    </span>


                                                    <div>

                                                        <strong>
                                                            Meeting link not added yet
                                                        </strong>

                                                        <p>
                                                            Your counsellor will add
                                                            the meeting link before
                                                            your counselling session.
                                                        </p>

                                                    </div>

                                                </div>

                                            )}

                                        </div>

                                    )}


                                    {/* =================================================
                                       FOOTER
                                    ================================================= */}

                                    <div className="appointment-footer">


                                        <span>
                                            🎯 Career Counselling Session
                                        </span>


                                        <button
                                            onClick={() =>
                                                handleViewCounsellor(
                                                    appointment.counsellor_id
                                                )
                                            }
                                        >

                                            View Counsellor →

                                        </button>


                                    </div>


                                </div>

                            )
                        )}

                    </div>

                )}

            </main>

        </div>

    );

}


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default MyAppointments;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CounsellorDashboard.css";

function CounsellorDashboard() {

    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    // =====================================================
    // COUNSELLOR PROFILE
    // =====================================================

    const [counsellor, setCounsellor] = useState(null);
    const [feeLoading, setFeeLoading] = useState(true);

    const navigate = useNavigate();

    // =====================================================
    // GET TOKEN
    // =====================================================

    const getToken = () => {
        return localStorage.getItem("token");
    };

    // =====================================================
    // FETCH APPOINTMENTS
    // =====================================================

    const fetchAppointments = async () => {

        const token = getToken();

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            setLoading(true);

            const response = await api.get(
                "/appointments/counsellor",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "COUNSELLOR APPOINTMENTS:",
                response.data.appointments
            );

            setAppointments(
                response.data.appointments || []
            );

        } catch (error) {

            console.log(
                "Appointment Error:",
                error.response?.data || error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to load appointments"
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // FETCH COUNSELLOR PROFILE + CONSULTATION FEE
    // =====================================================

    const fetchCounsellorProfile = async () => {

        const token = getToken();

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            setFeeLoading(true);

            const response = await api.get(
                "/counsellors",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const user = JSON.parse(
                localStorage.getItem("user")
            );

            const counsellors =
                response.data.counsellors || [];

            console.log(
                "COUNSELLORS API DATA:",
                counsellors
            );

            console.log(
                "LOGGED IN USER:",
                user
            );

            // =================================================
            // FIND LOGGED-IN COUNSELLOR
            // =================================================

            const currentCounsellor =
                counsellors.find(
                    (item) =>
                        Number(item.user_id) ===
                        Number(user?.id)
                );

            console.log(
                "CURRENT COUNSELLOR FEE:",
                currentCounsellor?.consultation_fee
            );

            if (currentCounsellor) {

                setCounsellor(currentCounsellor);

            } else {

                console.log(
                    "Logged-in counsellor profile not found"
                );

            }

        } catch (error) {

            console.log(
                "Counsellor Profile Error:",
                error.response?.data || error
            );

        } finally {

            setFeeLoading(false);

        }
    };

    // =====================================================
    // FETCH DATA
    // =====================================================

    useEffect(() => {

        fetchAppointments();
        fetchCounsellorProfile();

    }, []);

    // =====================================================
    // UPDATE APPOINTMENT STATUS
    // =====================================================

    const updateStatus = async (id, status) => {

        try {

            const token = getToken();

            if (!token) {
                navigate("/login");
                return;
            }

            await api.put(
                `/appointments/${id}/status`,
                {
                    status: status
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(
                `Appointment ${status} successfully.`
            );

            fetchAppointments();

        } catch (error) {

            console.log(
                "Status Error:",
                error.response?.data || error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to update appointment"
            );
        }
    };

    // =====================================================
    // JOIN MEETING
    // =====================================================

    const handleJoinMeeting = (meetingLink) => {

        if (!meetingLink) {

            setMessage(
                "Meeting link is not available for this appointment."
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
    // LOGOUT
    // =====================================================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    // =====================================================
    // STATS
    // =====================================================

    const totalAppointments =
        appointments.length;

    const pendingAppointments =
        appointments.filter(
            (appointment) =>
                appointment.status === "pending"
        ).length;

    const approvedAppointments =
        appointments.filter(
            (appointment) =>
                appointment.status === "approved"
        ).length;

    const completedAppointments =
        appointments.filter(
            (appointment) =>
                appointment.status === "completed"
        ).length;

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="counsellor-dashboard">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="counsellor-header">

                <div>

                    <h1>
                        👩‍💼 CareerGuide Counsellor
                    </h1>

                    <p>
                        Manage your counselling sessions
                        and help students choose the right career.
                    </p>

                </div>

                <button
                    className="counsellor-logout"
                    onClick={logout}
                >
                    🚪 Logout
                </button>

            </header>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="counsellor-main">

                <div className="welcome-section">

                    <h2>
                        Counsellor Dashboard
                    </h2>

                    <p>
                        View student requests, manage appointments
                        and conduct personalised career counselling.
                    </p>

                </div>

                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <div className="quick-actions">

                    <button
                        onClick={() =>
                            navigate("/counsellor-availability")
                        }
                    >
                        📅 Manage Availability
                    </button>

                </div>

                {/* =================================================
                    CONSULTATION FEE
                ================================================= */}

                <div
                    className="consultation-fee-card"
                    style={{
                        background: "#fff7e6",
                        border: "1px solid #f3d39b",
                        borderRadius: "15px",
                        padding: "22px",
                        margin: "20px 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "20px"
                    }}
                >

                    <div>

                        <h3
                            style={{
                                margin: "0 0 8px",
                                color: "#97004f"
                            }}
                        >
                            💰 Consultation Fee
                        </h3>

                        <p
                            style={{
                                margin: 0,
                                color: "#666"
                            }}
                        >
                            Fee charged for one counselling session.
                        </p>

                    </div>

                    <div
                        style={{
                            fontSize: "28px",
                            fontWeight: "700",
                            color: "#97004f",
                            whiteSpace: "nowrap"
                        }}
                    >

                        {feeLoading ? (
                            "Loading..."
                        ) : counsellor ? (
                            `₹${Number(
                                counsellor.consultation_fee || 0
                            ).toLocaleString("en-IN")}`
                        ) : (
                            "₹500"
                        )}

                    </div>

                </div>

                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (

                    <div className="counsellor-message">

                        {message}

                        <button
                            onClick={() =>
                                setMessage("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}

                {/* =================================================
                    STATS
                ================================================= */}

                <div className="counsellor-stats">

                    <div className="stat-card">

                        <div className="stat-icon">
                            📋
                        </div>

                        <div>

                            <span>
                                Total Appointments
                            </span>

                            <strong>
                                {totalAppointments}
                            </strong>

                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            ⏳
                        </div>

                        <div>

                            <span>
                                Pending
                            </span>

                            <strong>
                                {pendingAppointments}
                            </strong>

                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            ✅
                        </div>

                        <div>

                            <span>
                                Approved
                            </span>

                            <strong>
                                {approvedAppointments}
                            </strong>

                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            🎓
                        </div>

                        <div>

                            <span>
                                Completed
                            </span>

                            <strong>
                                {completedAppointments}
                            </strong>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    APPOINTMENTS
                ================================================= */}

                <section className="appointments-section">

                    <div className="section-header">

                        <div>

                            <h2>
                                📅 Student Appointments
                            </h2>

                            <p>
                                Manage your counselling requests.
                            </p>

                        </div>

                        <button
                            className="refresh-button"
                            onClick={fetchAppointments}
                        >
                            🔄 Refresh
                        </button>

                    </div>

                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ⏳
                            </div>

                            <h3>
                                Loading appointments...
                            </h3>

                        </div>

                    ) : appointments.length === 0 ? (

                        /* =================================================
                           NO APPOINTMENTS
                        ================================================= */

                        <div className="empty-state">

                            <div className="empty-icon">
                                📭
                            </div>

                            <h3>
                                No appointments yet
                            </h3>

                            <p>
                                Student booking requests will
                                appear here.
                            </p>

                        </div>

                    ) : (

                        /* =================================================
                           APPOINTMENTS LIST
                        ================================================= */

                        <div className="appointment-list">

                            {appointments.map(
                                (appointment) => (

                                    <div
                                        className="appointment-card"
                                        key={appointment.id}
                                    >

                                        {/* =================================================
                                           TOP
                                        ================================================= */}

                                        <div className="appointment-top">

                                            <div>

                                                <span className="appointment-id">
                                                    Appointment #
                                                    {appointment.id}
                                                </span>

                                                <h3>
                                                    👨‍🎓{" "}
                                                    {appointment.student_name}
                                                </h3>

                                            </div>

                                            <span
                                                className={`status-badge status-${appointment.status}`}
                                            >
                                                {appointment.status}
                                            </span>

                                        </div>

                                        {/* =================================================
                                           STUDENT DETAILS
                                        ================================================= */}

                                        <div className="appointment-details">

                                            <div>

                                                <span>
                                                    📧 Email
                                                </span>

                                                <strong>
                                                    {appointment.student_email}
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    📅 Date
                                                </span>

                                                <strong>

                                                    {new Date(
                                                        appointment.appointment_date
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "long",
                                                            year: "numeric"
                                                        }
                                                    )}

                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    🕐 Time
                                                </span>

                                                <strong>
                                                    {appointment.appointment_time}
                                                </strong>

                                            </div>

                                        </div>

                                        {/* =================================================
                                           ACTIONS
                                        ================================================= */}

                                        <div className="appointment-actions">

                                            {/* =================================================
                                               PENDING
                                            ================================================= */}

                                            {appointment.status ===
                                                "pending" && (

                                                <>

                                                    <button
                                                        className="approve-button"
                                                        onClick={() =>
                                                            updateStatus(
                                                                appointment.id,
                                                                "approved"
                                                            )
                                                        }
                                                    >
                                                        ✅ Approve
                                                    </button>

                                                    <button
                                                        className="reject-button"
                                                        onClick={() =>
                                                            updateStatus(
                                                                appointment.id,
                                                                "rejected"
                                                            )
                                                        }
                                                    >
                                                        ❌ Reject
                                                    </button>

                                                </>
                                            )}

                                            {/* =================================================
                                               APPROVED
                                            ================================================= */}

                                            {appointment.status ===
                                                "approved" && (

                                                <>

                                                    {/* JOIN MEETING */}

                                                    {appointment.meeting_link && (

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

                                                    )}

                                                    {/* MARK COMPLETED */}

                                                    <button
                                                        className="complete-button"
                                                        onClick={() =>
                                                            updateStatus(
                                                                appointment.id,
                                                                "completed"
                                                            )
                                                        }
                                                    >
                                                        🎓 Mark Completed
                                                    </button>

                                                </>
                                            )}

                                            {/* =================================================
                                               COMPLETED
                                            ================================================= */}

                                            {appointment.status ===
                                                "completed" && (

                                                <span className="completed-text">
                                                    ✔ Counselling completed
                                                </span>

                                            )}

                                            {/* =================================================
                                               REJECTED
                                            ================================================= */}

                                            {appointment.status ===
                                                "rejected" && (

                                                <span className="rejected-text">
                                                    ✕ Appointment rejected
                                                </span>

                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default CounsellorDashboard;
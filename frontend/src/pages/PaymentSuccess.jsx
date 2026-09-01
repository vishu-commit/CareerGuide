import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

function PaymentSuccess() {

    const navigate = useNavigate();
    const location = useLocation();

    const {
        counsellorId,
        appointmentDate,
        appointmentTime,
        amount
    } = location.state || {};


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (value) => {

        if (!value) {
            return "N/A";
        }

        if (
            typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}/.test(value)
        ) {

            const datePart = value.substring(0, 10);

            const [year, month, day] =
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

        return new Date(value).toLocaleDateString(
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

        const parts = String(value).split(":");

        if (parts.length >= 2) {

            let hour = Number(parts[0]);

            const minute = parts[1];

            const period =
                hour >= 12 ? "PM" : "AM";

            hour = hour % 12 || 12;

            return `${hour}:${minute} ${period}`;
        }

        return value;
    };


    return (

        <div className="payment-success-page">

            <div className="payment-success-container">

                {/* =========================================
                    SUCCESS ICON
                ========================================= */}

                <div className="success-icon">
                    ✓
                </div>


                {/* =========================================
                    HEADING
                ========================================= */}

                <h1>
                    Payment Successful!
                </h1>


                <p className="success-subtitle">
                    Your counselling appointment has been
                    confirmed successfully.
                </p>


                {/* =========================================
                    SUCCESS CARD
                ========================================= */}

                <div className="success-card">

                    <div className="success-card-icon">
                        🎉
                    </div>

                    <h2>
                        Appointment Confirmed
                    </h2>

                    <p>
                        Your counselling session has been
                        successfully booked.
                    </p>


                    {/* =====================================
                        APPOINTMENT DETAILS
                    ===================================== */}

                    <div className="appointment-summary">

                        <h3>
                            📋 Appointment Details
                        </h3>


                        {/* DATE */}

                        <div className="summary-row">

                            <span>
                                📅 Date
                            </span>

                            <strong>
                                {formatDate(
                                    appointmentDate
                                )}
                            </strong>

                        </div>


                        {/* TIME */}

                        <div className="summary-row">

                            <span>
                                ⏰ Time
                            </span>

                            <strong>
                                {formatTime(
                                    appointmentTime
                                )}
                            </strong>

                        </div>


                        {/* COUNSELLOR */}

                        <div className="summary-row">

                            <span>
                                👩‍💼 Counsellor
                            </span>

                            <strong>
                                {counsellorId
                                    ? `Counsellor #${counsellorId}`
                                    : "N/A"}
                            </strong>

                        </div>


                        {/* FEE */}

                        <div className="summary-row">

                            <span>
                                💰 Consultation Fee
                            </span>

                            <strong>
                                ₹{amount || 500}
                            </strong>

                        </div>


                        {/* PAYMENT STATUS */}

                        <div className="summary-row">

                            <span>
                                💳 Payment Status
                            </span>

                            <strong className="paid-status">
                                Paid
                            </strong>

                        </div>

                    </div>


                    {/* =====================================
                        DEMO NOTICE
                    ===================================== */}

                    <div className="success-notice">

                        ℹ️ This was a demo payment.
                        No real money was charged.

                    </div>


                    {/* =====================================
                        BUTTONS
                    ===================================== */}

                    <div className="success-buttons">

                        <button
                            className="view-appointments-button"
                            onClick={() =>
                                navigate("/appointments")
                            }
                        >
                            📅 View My Appointments
                        </button>


                        <button
                            className="back-dashboard-button"
                            onClick={() =>
                                navigate("/student-dashboard")
                            }
                        >
                            ← Back to Dashboard
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default PaymentSuccess;
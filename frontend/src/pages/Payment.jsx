import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import "./Payment.css";

function Payment() {

    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const counsellorId =
        location.state?.counsellorId;

    const appointmentDate =
        location.state?.appointmentDate;

    const appointmentTime =
        location.state?.appointmentTime;

    const amount =
        location.state?.amount || 500;


    // =====================================================
    // PAYMENT
    // =====================================================

    const handlePayment = async () => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            navigate("/login");

            return;
        }


        if (
            !counsellorId ||
            !appointmentDate ||
            !appointmentTime
        ) {

            setMessage(
                "Appointment details are missing."
            );

            return;
        }


        try {

            setLoading(true);
            setMessage("");


            // =================================================
            // DEMO PAYMENT
            // =================================================

            await new Promise(resolve =>
                setTimeout(resolve, 1500)
            );


            // =================================================
            // PAYMENT SUCCESS
            // =================================================

            navigate(
                "/payment-success",
                {
                    state: {
                        counsellorId,
                        appointmentDate,
                        appointmentTime,
                        amount
                    }
                }
            );


        } catch (error) {

            console.log(
                "Payment Error:",
                error
            );

            setMessage(
                "Payment failed. Please try again."
            );

            setLoading(false);
        }
    };


    return (

        <div className="payment-page">

            <div className="payment-container">

                {/* BACK BUTTON */}

                <button
                    className="payment-back-button"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    ← Back
                </button>


                <div className="payment-card">

                    {/* ICON */}

                    <div className="payment-icon">
                        💳
                    </div>


                    <h1>
                        Complete Payment
                    </h1>


                    <p className="payment-subtitle">
                        Pay the consultation fee to confirm
                        your counselling appointment.
                    </p>


                    {/* =================================================
                        APPOINTMENT DETAILS
                    ================================================= */}

                    <div className="payment-details">

                        <div>

                            <span>
                                📅 Appointment Date
                            </span>

                            <strong>
                                {appointmentDate || "N/A"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                ⏰ Appointment Time
                            </span>

                            <strong>
                                {appointmentTime || "N/A"}
                            </strong>

                        </div>

                    </div>


                    {/* =================================================
                        AMOUNT
                    ================================================= */}

                    <div className="payment-amount">

                        <span>
                            💰 Consultation Fee
                        </span>

                        <strong>
                            ₹{amount}
                        </strong>

                    </div>


                    {/* =================================================
                        PAYMENT METHODS
                    ================================================= */}

                    <h3>
                        Select Payment Method
                    </h3>


                    <div className="payment-methods">

                        <div className="payment-method active">

                            <span>
                                📱
                            </span>

                            <div>

                                <strong>
                                    UPI
                                </strong>

                                <small>
                                    Demo Payment
                                </small>

                            </div>

                        </div>


                        <div className="payment-method">

                            <span>
                                💳
                            </span>

                            <div>

                                <strong>
                                    Card
                                </strong>

                                <small>
                                    Demo Payment
                                </small>

                            </div>

                        </div>


                        <div className="payment-method">

                            <span>
                                🏦
                            </span>

                            <div>

                                <strong>
                                    Net Banking
                                </strong>

                                <small>
                                    Demo Payment
                                </small>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        ERROR MESSAGE
                    ================================================= */}

                    {message && (

                        <div className="demo-notice">

                            ⚠️ {message}

                        </div>

                    )}


                    {/* =================================================
                        DEMO NOTICE
                    ================================================= */}

                    {!message && (

                        <div className="demo-notice">

                            ℹ️ This is a demo payment for the
                            CareerGuide project. No real money
                            will be charged.

                        </div>

                    )}


                    {/* =================================================
                        PAY BUTTON
                    ================================================= */}

                    <button
                        className="pay-button"
                        onClick={handlePayment}
                        disabled={loading}
                    >

                        {loading
                            ? "Processing Payment..."
                            : `Pay ₹${amount} & Confirm Appointment →`
                        }

                    </button>

                </div>

            </div>

        </div>
    );
}


export default Payment;
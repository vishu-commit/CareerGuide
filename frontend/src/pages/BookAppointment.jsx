import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../services/api";

import "./BookAppointment.css";


function BookAppointment() {

    const { id } = useParams();

    const navigate = useNavigate();

    const location = useLocation();


    // =====================================================
    // NORMALIZE DATE
    // =====================================================

    const normalizeDate = (date) => {

        if (!date) {
            return "";
        }

        if (
            typeof date === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(date)
        ) {
            return date;
        }

        if (typeof date === "string") {

            const match = date.match(
                /^(\d{4}-\d{2}-\d{2})/
            );

            if (match) {
                return match[1];
            }
        }

        if (date instanceof Date) {

            const year = date.getFullYear();

            const month = String(
                date.getMonth() + 1
            ).padStart(2, "0");

            const day = String(
                date.getDate()
            ).padStart(2, "0");

            return `${year}-${month}-${day}`;
        }

        return "";
    };


    // =====================================================
    // NORMALIZE TIME
    // =====================================================

    const normalizeTime = (time) => {

        if (!time) {
            return "";
        }

        if (typeof time === "string") {

            const match = time.match(
                /^(\d{2}):(\d{2})/
            );

            if (match) {
                return `${match[1]}:${match[2]}`;
            }
        }

        return "";
    };


    // =====================================================
    // STATE
    // =====================================================

    const [appointmentDate, setAppointmentDate] =
        useState(
            normalizeDate(
                location.state?.appointmentDate
            )
        );


    const [appointmentTime, setAppointmentTime] =
        useState(
            normalizeTime(
                location.state?.appointmentTime
            )
        );


    const [consultationFee, setConsultationFee] =
        useState(500);


    const [message, setMessage] =
        useState("");


    // =====================================================
    // FETCH COUNSELLOR
    // =====================================================

    useEffect(() => {

        const fetchCounsellor = async () => {

            const token =
                localStorage.getItem("token");

            if (!token) {

                navigate("/login");

                return;
            }

            try {

                const response = await api.get(
                    `/counsellors/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const counsellor =
                    response.data.counsellor;

                if (
                    counsellor &&
                    counsellor.consultation_fee !==
                    undefined &&
                    counsellor.consultation_fee !== null
                ) {

                    setConsultationFee(
                        Number(
                            counsellor.consultation_fee
                        )
                    );
                }

            } catch (error) {

                console.log(
                    "Counsellor Error:",
                    error.response?.data || error
                );
            }
        };

        fetchCounsellor();

    }, [id, navigate]);


    // =====================================================
    // PROCEED TO PAYMENT
    // =====================================================

    const handleProceedToPayment = (e) => {

        e.preventDefault();

        if (
            !appointmentDate ||
            !appointmentTime
        ) {

            setMessage(
                "Please select date and time."
            );

            return;
        }


        const finalDate =
            normalizeDate(
                appointmentDate
            );


        const finalTime =
            normalizeTime(
                appointmentTime
            );


        console.log(
            "Proceeding to payment with:"
        );

        console.log({
            counsellorId: Number(id),
            appointmentDate: finalDate,
            appointmentTime: finalTime,
            consultationFee
        });


        // IMPORTANT:
        // YAHAN APPOINTMENT DATABASE MEIN CREATE NAHI HOGI.
        // Sirf payment page par data bhej rahe hain.

        navigate(
            "/payment",
            {
                state: {
                    counsellorId: Number(id),
                    appointmentDate: finalDate,
                    appointmentTime: finalTime,
                    amount: consultationFee
                }
            }
        );
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="book-appointment-page">

            <div className="book-appointment-container">

                {/* HEADER */}

                <div className="book-header">

                    <button
                        className="book-back-button"
                        onClick={() =>
                            navigate(
                                `/counsellors/${id}`
                            )
                        }
                    >
                        ← Back to Counsellor
                    </button>


                    <h1>
                        📅 Book Counselling Appointment
                    </h1>


                    <p>
                        Select your preferred date and time
                        for the counselling session.
                    </p>

                </div>


                {/* BOOKING CARD */}

                <div className="booking-card">

                    <div className="booking-icon">
                        👩‍💼
                    </div>


                    <h2>
                        Counselling Session
                    </h2>


                    <p className="booking-description">
                        Book a personalised career counselling
                        session with your selected counsellor.
                    </p>


                    <form
                        onSubmit={
                            handleProceedToPayment
                        }
                    >

                        {/* DATE */}

                        <div className="booking-field">

                            <label>
                                📅 Appointment Date
                            </label>

                            <input
                                type="date"
                                value={appointmentDate}
                                onChange={(e) =>
                                    setAppointmentDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* TIME */}

                        <div className="booking-field">

                            <label>
                                ⏰ Appointment Time
                            </label>

                            <input
                                type="time"
                                value={appointmentTime}
                                onChange={(e) =>
                                    setAppointmentTime(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* FEE */}

                        <div className="booking-fee">

                            <span>
                                💰 Consultation Fee
                            </span>

                            <strong>
                                ₹{consultationFee}
                            </strong>

                        </div>


                        {/* MESSAGE */}

                        {message && (

                            <div
                                className="booking-message"
                                style={{
                                    background:
                                        "#fff1d6",

                                    color:
                                        "#7c4a03"
                                }}
                            >
                                {message}
                            </div>

                        )}


                        {/* PAYMENT BUTTON */}

                        <button
                            type="submit"
                            className="confirm-booking-button"
                        >
                            Proceed to Payment →
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}


export default BookAppointment;
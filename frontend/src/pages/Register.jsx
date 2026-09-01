import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [role, setRole] = useState("student");

    const [specialization, setSpecialization] = useState("");
    const [experience, setExperience] = useState("");
    const [consultationFee, setConsultationFee] = useState("500");
    const [bio, setBio] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // =====================================================
    // REGISTER
    // =====================================================

    const handleRegister = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (
            !name.trim() ||
            !email.trim() ||
            !password.trim()
        ) {

            setError("Please fill all the required fields.");

            return;
        }


        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        // =================================================
        // COUNSELLOR VALIDATION
        // =================================================

        if (role === "counsellor") {

            if (!specialization.trim()) {

                setError(
                    "Please enter your specialization."
                );

                return;
            }


            if (
                experience === "" ||
                Number(experience) < 0
            ) {

                setError(
                    "Please enter valid experience."
                );

                return;
            }


            if (
                consultationFee === "" ||
                Number(consultationFee) < 0
            ) {

                setError(
                    "Please enter a valid consultation fee."
                );

                return;
            }

        }


        try {

            setLoading(true);


            // =================================================
            // REGISTER USER
            // =================================================

            const response = await api.post(
                "/auth/register",
                {
                    name: name.trim(),
                    email: email.trim(),
                    password,
                    role,

                    ...(role === "counsellor" && {
                        specialization: specialization.trim(),
                        experience: Number(experience),
                        consultation_fee:
                            Number(consultationFee),
                        bio: bio.trim()
                    })
                }
            );


            setMessage(
                response.data.message ||
                "Registration successful!"
            );


            // =================================================
            // CLEAR FORM
            // =================================================

            setName("");
            setEmail("");
            setPassword("");

            setRole("student");

            setSpecialization("");
            setExperience("");
            setConsultationFee("500");
            setBio("");


            // =================================================
            // GO TO LOGIN
            // =================================================

            setTimeout(() => {

                navigate("/login");

            }, 1500);


        } catch (error) {

            console.log(
                "Register Error:",
                error.response?.data || error
            );


            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="register-page">


            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="register-info">

                <div className="register-brand">

                    <div className="brand-icon">
                        🎯
                    </div>

                    <h1>
                        CareerGuide
                    </h1>

                </div>


                <div className="register-info-content">

                    <span className="welcome-badge">
                        ✨ Start Your Journey
                    </span>


                    <h2>
                        Discover the career
                        <br />
                        that's right for you.
                    </h2>


                    <p>
                        Create your CareerGuide account
                        and get personalized career guidance
                        based on your interests, skills and goals.
                    </p>


                    <div className="register-features">

                        <div className="register-feature">

                            <span>
                                🤖
                            </span>

                            <div>

                                <strong>
                                    Free AI Counselling
                                </strong>

                                <small>
                                    Find careers that match you
                                </small>

                            </div>

                        </div>


                        <div className="register-feature">

                            <span>
                                🎓
                            </span>

                            <div>

                                <strong>
                                    Explore Courses
                                </strong>

                                <small>
                                    Discover the right learning path
                                </small>

                            </div>

                        </div>


                        <div className="register-feature">

                            <span>
                                👨‍🏫
                            </span>

                            <div>

                                <strong>
                                    Human Counselling
                                </strong>

                                <small>
                                    Connect with professional counsellors
                                </small>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="register-form-area">

                <div className="register-card">


                    {/* MOBILE BRAND */}

                    <div className="mobile-brand">

                        <div className="brand-icon">
                            🎯
                        </div>

                        <h1>
                            CareerGuide
                        </h1>

                    </div>


                    {/* HEADER */}

                    <div className="register-header">

                        <span className="form-icon">
                            👋
                        </span>

                        <h2>
                            Create Your Account
                        </h2>

                        <p>
                            Join CareerGuide and start
                            exploring your future.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="register-error">

                            ⚠️ {error}

                        </div>

                    )}


                    {/* SUCCESS */}

                    {message && (

                        <div className="register-success">

                            ✓ {message}

                        </div>

                    )}


                    <form
                        onSubmit={handleRegister}
                        className="register-form"
                    >


                        {/* =================================================
                            NAME
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Full Name
                            </label>

                            <div className="input-wrapper">

                                <span>
                                    👤
                                </span>

                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                />

                            </div>

                        </div>


                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <span>
                                    ✉️
                                </span>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />

                            </div>

                        </div>


                        {/* =================================================
                            PASSWORD
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <div className="input-wrapper">

                                <span>
                                    🔒
                                </span>

                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                            </div>

                            <small className="password-hint">
                                Use at least 6 characters
                            </small>

                        </div>


                        {/* =================================================
                            ACCOUNT TYPE
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                I want to register as
                            </label>


                            <div className="role-selection">

                                <button
                                    type="button"
                                    className={
                                        role === "student"
                                            ? "role-option active"
                                            : "role-option"
                                    }
                                    onClick={() =>
                                        setRole("student")
                                    }
                                >

                                    <span>
                                        🎓
                                    </span>

                                    <div>

                                        <strong>
                                            Student
                                        </strong>

                                        <small>
                                            Find the right career
                                        </small>

                                    </div>

                                </button>


                                <button
                                    type="button"
                                    className={
                                        role === "counsellor"
                                            ? "role-option active"
                                            : "role-option"
                                    }
                                    onClick={() =>
                                        setRole("counsellor")
                                    }
                                >

                                    <span>
                                        👨‍🏫
                                    </span>

                                    <div>

                                        <strong>
                                            Counsellor
                                        </strong>

                                        <small>
                                            Guide students
                                        </small>

                                    </div>

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            COUNSELLOR DETAILS
                        ================================================= */}

                        {role === "counsellor" && (

                            <div className="counsellor-register-box">


                                <div className="counsellor-register-heading">

                                    👨‍🏫 Counsellor Details

                                </div>


                                {/* SPECIALIZATION */}

                                <div className="form-group">

                                    <label>
                                        Specialization *
                                    </label>

                                    <div className="input-wrapper">

                                        <span>
                                            🎯
                                        </span>

                                        <input
                                            type="text"
                                            placeholder="e.g. Career Guidance"
                                            value={specialization}
                                            onChange={(e) =>
                                                setSpecialization(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>


                                {/* EXPERIENCE */}

                                <div className="form-group">

                                    <label>
                                        Experience (Years) *
                                    </label>

                                    <div className="input-wrapper">

                                        <span>
                                            ⭐
                                        </span>

                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="e.g. 3"
                                            value={experience}
                                            onChange={(e) =>
                                                setExperience(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>


                                {/* CONSULTATION FEE */}

                                <div className="form-group">

                                    <label>
                                        Consultation Fee (₹) *
                                    </label>

                                    <div className="input-wrapper">

                                        <span>
                                            💰
                                        </span>

                                        <input
                                            type="number"
                                            min="0"
                                            value={consultationFee}
                                            onChange={(e) =>
                                                setConsultationFee(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>


                                {/* BIO */}

                                <div className="form-group">

                                    <label>
                                        About You
                                    </label>

                                    <textarea
                                        placeholder="Tell students a little about yourself..."
                                        value={bio}
                                        onChange={(e) =>
                                            setBio(e.target.value)
                                        }
                                    />

                                </div>


                                <div className="verification-note">

                                    ℹ️ Your counsellor account will be
                                    reviewed by an admin before you can
                                    accept appointments.

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            REGISTER BUTTON
                        ================================================= */}

                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account →"
                            }

                        </button>

                    </form>


                    {/* LOGIN */}

                    <div className="login-link">

                        Already have an account?

                        {" "}

                        <Link to="/login">
                            Login here
                        </Link>

                    </div>


                    {/* FOOTER */}

                    <div className="register-footer">

                        🔐 Your information is secure with us.

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Register;
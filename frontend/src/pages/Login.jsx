import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            // Token save
            localStorage.setItem("token", response.data.token);

            // User information save
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            const role = response.data.user.role;

            setMessage("Login successful!");

            // Role ke according dashboard
            if (role === "admin") {
                navigate("/admin-dashboard");
            } else if (role === "counsellor") {
                navigate("/counsellor-dashboard");
            } else if (role === "student") {
                navigate("/student-dashboard");
            } else {
                setMessage("Invalid user role");
            }

        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message || "Login failed"
            );
        }
    };

    return (
        <div className="login-page">

            {/* LEFT SIDE */}
            <div className="login-info">

                <div className="brand">
                    CareerGuide
                </div>

                <div className="hero-content">
                    <p className="small-title">
                        YOUR FUTURE STARTS HERE
                    </p>

                    <h1>
                        Find the Career
                        <br />
                        That's Right for You.
                    </h1>

                    <p className="hero-text">
                        Discover your skills, explore career options,
                        connect with counsellors and build your future
                        with the right guidance.
                    </p>

                    <div className="career-points">
                        <span>✓ Career Discovery</span>
                        <span>✓ Expert Counselling</span>
                        <span>✓ Course & College Guidance</span>
                    </div>
                </div>

            </div>


            {/* RIGHT SIDE LOGIN */}
            <div className="login-area">

                <div className="login-card">

                    

                    <h2>
                        Welcome Back
                    </h2>

                    <p className="login-subtitle">
                        Login to continue your career journey
                    </p>


                    <form onSubmit={handleLogin}>

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />


                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />


                        <button
                            type="submit"
                            className="login-button"
                        >
                            Login
                            <span>→</span>
                        </button>

                    </form>


                    {message && (
                        <p className="login-message">
                            {message}
                        </p>
                    )}


                    <p className="register-text">
                        Don't have an account?
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                        >
                            Create Account
                        </button>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;
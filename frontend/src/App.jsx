import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";

import StudentDashboard from "./pages/StudentDashboard";
import StudentLayout from "./pages/StudentLayout";
import Profile from "./pages/Profile";

import Counsellors from "./pages/Counsellors";
import CounsellorProfile from "./pages/CounsellorProfile";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";

import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";

import CounsellorDashboard from "./pages/CounsellorDashboard";
import CounsellorAvailability from "./pages/CounsellorAvailability";

import AdminDashboard from "./pages/AdminDashboard";

import CareerRecommendation from "./pages/CareerRecommendation";
import CareerDetails from "./pages/CareerDetails";
import Roadmap from "./pages/Roadmap";
import Courses from "./pages/Courses";
import Colleges from "./pages/Colleges";

import ProtectedRoute from "./ProtectedRoute";

import AICounselling from "./pages/AICounselling";
import CareerAssessment from "./pages/CareerAssessment";
import AICounsellingHistory from "./pages/AICounsellingHistory";
import CounsellingHistory from "./pages/CounsellingHistory";


function App() {

    return (

        <BrowserRouter>

            {/* =================================================
                PUBLIC NAVBAR
            ================================================= */}

            <nav>
                <Link to="/register">Register</Link>
                {" | "}
                <Link to="/login">Login</Link>
            </nav>


            <Routes>
                   <Route
    path="/"
    element={<Navigate to="/login" replace />}
/>
                {/* =================================================
                    PUBLIC ROUTES
                ================================================= */}

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =================================================
                    STUDENT ROUTES
                    StudentLayout = Sidebar + Topbar
                ================================================= */}

                <Route
                    element={
                        <ProtectedRoute role="student">
                            <StudentLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* =========================
                        DASHBOARD
                    ========================= */}

                    <Route
                        path="/student-dashboard"
                        element={<StudentDashboard />}
                    />

                    <Route
                        path="/dashboard"
                        element={<StudentDashboard />}
                    />


                    {/* =========================
                        PROFILE
                    ========================= */}

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />


                    {/* =========================
                        CAREERS
                    ========================= */}

                    <Route
                        path="/careers"
                        element={<CareerRecommendation />}
                    />

                    <Route
                        path="/careers/:id"
                        element={<CareerDetails />}
                    />


                    {/* =========================
                        COURSES
                    ========================= */}

                    <Route
                        path="/courses"
                        element={<Courses />}
                    />

                    <Route
                        path="/courses/:careerId"
                        element={<Courses />}
                    />


                    {/* =========================
                        COLLEGES
                    ========================= */}

                    <Route
                        path="/colleges"
                        element={<Colleges />}
                    />


                    {/* =========================
                        ROADMAP
                    ========================= */}

                    <Route
                        path="/roadmap/:careerId"
                        element={<Roadmap />}
                    />


                    {/* =========================
                        COUNSELLORS
                    ========================= */}

                    <Route
                        path="/counsellors"
                        element={<Counsellors />}
                    />

                    <Route
                        path="/counsellors/:id"
                        element={<CounsellorProfile />}
                    />

                    <Route
                        path="/counsellors/:id/book"
                        element={<BookAppointment />}
                    />


                    {/* =========================
                        APPOINTMENTS
                    ========================= */}

                    <Route
                        path="/appointments"
                        element={<MyAppointments />}
                    />

                </Route>


                {/* =================================================
                    PAYMENT ROUTES
                ================================================= */}

                <Route
                    path="/payment"
                    element={
                        <ProtectedRoute role="student">
                            <Payment />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/payment-success"
                    element={
                        <ProtectedRoute role="student">
                            <PaymentSuccess />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    COUNSELLOR ROUTES
                ================================================= */}

                <Route
                    path="/counsellor-dashboard"
                    element={
                        <ProtectedRoute role="counsellor">
                            <CounsellorDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/counsellor-availability"
                    element={
                        <ProtectedRoute role="counsellor">
                            <CounsellorAvailability />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    ADMIN ROUTE
                ================================================= */}

                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    AI COUNSELLING
                ================================================= */}

                <Route
                    path="/ai-counselling"
                    element={
                        <ProtectedRoute role="student">
                            <AICounselling />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    CAREER ASSESSMENT
                ================================================= */}

                <Route
                    path="/career-assessment"
                    element={
                        <ProtectedRoute role="student">
                            <CareerAssessment />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    AI COUNSELLING HISTORY
                ================================================= */}

                <Route
                    path="/ai-counselling-history"
                    element={
                        <ProtectedRoute role="student">
                            <AICounsellingHistory />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    HUMAN COUNSELLING HISTORY
                ================================================= */}

                <Route
                    path="/counselling-history"
                    element={
                        <ProtectedRoute role="student">
                            <CounsellingHistory />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;
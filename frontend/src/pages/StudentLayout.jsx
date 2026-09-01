import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./StudentLayout.css";


function StudentLayout() {

    const navigate = useNavigate();


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };


    return (

        <div className="student-layout">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="student-sidebar">


                {/* =================================================
                    BRAND
                ================================================= */}

                <div className="student-brand">

                    <div className="brand-icon">
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


                {/* =================================================
                    MENU
                ================================================= */}

                <nav className="student-menu">


                    {/* =================================================
                        OVERVIEW
                    ================================================= */}

                    <NavLink
                        to="/student-dashboard"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active"
                                : "menu-link"
                        }
                    >

                        <span>🏠</span>

                        Overview

                    </NavLink>


                    {/* =================================================
                        FREE AI COUNSELLING
                    ================================================= */}

                    <NavLink
                        to="/ai-counselling"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active ai-menu-link"
                                : "menu-link ai-menu-link"
                        }
                    >

                        <span>🤖</span>

                        Free AI Counselling

                    </NavLink>


                    {/* =================================================
                        MY PROFILE
                    ================================================= */}

                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active"
                                : "menu-link"
                        }
                    >

                        <span>👤</span>

                        My Profile

                    </NavLink>


                    {/* =================================================
                        FIND CAREER
                    ================================================= */}

                    <NavLink
                        to="/careers"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active"
                                : "menu-link"
                        }
                    >

                        <span>🎯</span>

                        Find Career

                    </NavLink>


                    {/* =================================================
                        COURSES
                        
                        IMPORTANT:
                        Course page requires careerId.
                        Therefore sidebar sends student to
                        Find Career first.
                    ================================================= */}

                    <NavLink
                        to="/careers"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active"
                                : "menu-link"
                        }
                    >

                        <span>🎓</span>

                        Courses

                    </NavLink>


                    {/* =================================================
                        COLLEGES
                    ================================================= */}

                    <NavLink
                        to="/colleges"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active"
                                : "menu-link"
                        }
                    >

                        <span>🏫</span>

                        Colleges

                    </NavLink>


                    {/* =================================================
                        CAREER ROADMAP
                        
                        IMPORTANT:
                        Roadmap requires careerId.
                        Therefore sidebar sends student to
                        Find Career first.
                    ================================================= */}

                    <NavLink
                        to="/careers"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active"
                                : "menu-link"
                        }
                    >

                        <span>🗺️</span>

                        Career Roadmap

                    </NavLink>


                    {/* =================================================
                        COUNSELLORS
                    ================================================= */}

                    <NavLink
                        to="/counsellors"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active"
                                : "menu-link"
                        }
                    >

                        <span>👨‍🏫</span>

                        Counsellors

                    </NavLink>


                    {/* =================================================
                        MY APPOINTMENTS
                    ================================================= */}

                    <NavLink
                        to="/appointments"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active"
                                : "menu-link"
                        }
                    >

                        <span>📅</span>

                        My Appointments

                    </NavLink>

                </nav>


                {/* =================================================
                    LOGOUT
                ================================================= */}

                <button
                    className="student-logout"
                    onClick={handleLogout}
                >

                    <span>
                        🚪
                    </span>

                    <span>
                        Logout
                    </span>

                </button>


            </aside>


            {/* =================================================
                MAIN AREA
            ================================================= */}

            <main className="student-main">


                {/* =================================================
                    TOPBAR
                ================================================= */}

                <header className="student-topbar">

                    <div>

                        <h1>
                            Student Dashboard
                        </h1>

                        <p>
                            Plan your career. Build your future.
                        </p>

                    </div>

                </header>


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <div className="student-page-content">

                    <Outlet />

                </div>


            </main>

        </div>

    );

}


export default StudentLayout;
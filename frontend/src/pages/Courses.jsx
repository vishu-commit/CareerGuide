import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./Courses.css";

function Courses() {

    const { careerId } = useParams();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {

        const fetchCourses = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {

                const response = await api.get(
                    `/courses/${careerId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setCourses(
                    response.data.courses || []
                );

            } catch (error) {

                console.log(
                    "Course Error:",
                    error.response?.data || error
                );

                setMessage(
                    error.response?.data?.message ||
                    "Failed to load courses"
                );
            }
        };

        fetchCourses();

    }, [careerId, navigate]);


    return (

        <div className="courses-page">

            <div className="courses-content">

                {/* BACK BUTTON */}

                <button
                    className="courses-back-button"
                    onClick={() =>
                        navigate(`/careers/${careerId}`)
                    }
                >
                    ← Back to Career
                </button>


                {/* HEADER */}

                <div className="courses-header">

                    <h1>
                        🎓 Courses
                    </h1>

                    <p>
                        Courses available for this career.
                    </p>

                </div>


                {/* ERROR MESSAGE */}

                {message && (
                    <div className="courses-message">
                        {message}
                    </div>
                )}


                {/* COURSES */}

                {courses.length > 0 ? (

                    <div className="courses-grid">

                        {courses.map((course) => (

                            <div
                                className="course-card"
                                key={course.id}
                            >

                                {/* ICON */}

                                <div className="course-icon">
                                    🎓
                                </div>


                                {/* COURSE NAME */}

                                <h2>
                                    {course.course_name}
                                </h2>


                                {/* DESCRIPTION */}

                                <p>
                                    {course.description}
                                </p>


                                {/* DURATION */}

                                <span className="course-duration">
                                    ⏱️ {course.duration}
                                </span>

                            </div>

                        ))}

                    </div>

                ) : (

                    !message && (

                        <div className="courses-message">
                            Loading courses...
                        </div>

                    )

                )}

            </div>

        </div>

    );
}

export default Courses;
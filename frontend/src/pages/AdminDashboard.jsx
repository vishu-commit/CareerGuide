import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [counsellors, setCounsellors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const fetchData = async () => {
        const token = getToken();

        if (!token) {
            navigate("/login");
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            const [usersResponse, counsellorsResponse, appointmentsResponse] =
                await Promise.all([
                    api.get("/admin/users", config),
                    api.get("/admin/counsellors", config),
                    api.get("/admin/appointments", config)
                ]);

            setUsers(usersResponse.data.users);
            setCounsellors(counsellorsResponse.data.counsellors);
            console.log(
    "ADMIN COUNSELLORS DATA:",
    JSON.stringify(
        counsellorsResponse.data.counsellors,
        null,
        2
    )
);
            setAppointments(appointmentsResponse.data.appointments);

        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to load admin dashboard"
            );
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // =====================================================
    // DELETE USER
    // =====================================================

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = getToken();

            await api.delete(`/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage("User deleted successfully");

            fetchData();

        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to delete user"
            );
        }
    };

    // =====================================================
    // APPROVE COUNSELLOR
    // =====================================================

    const approveCounsellor = async (id) => {

        try {
            const token = getToken();

            await api.put(
                `/admin/counsellors/${id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Counsellor approved successfully");

            fetchData();

        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to approve counsellor"
            );
        }
    };

    // =====================================================
    // REJECT COUNSELLOR
    // =====================================================

    const rejectCounsellor = async (id) => {

        try {
            const token = getToken();

            await api.put(
                `/admin/counsellors/${id}/reject`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Counsellor rejected successfully");

            fetchData();

        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to reject counsellor"
            );
        }
    };

    // =====================================================
    // PENDING COUNSELLOR
    // =====================================================

    const makePending = async (id) => {

        try {
            const token = getToken();

            await api.put(
                `/admin/counsellors/${id}/pending`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Counsellor status changed to pending");

            fetchData();

        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to change counsellor status"
            );
        }
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="admin-page">

            <nav className="admin-navbar">

                <h2>CareerGuide Admin</h2>

                <button onClick={logout}>
                    Logout
                </button>

            </nav>

            <main className="admin-content">

                <h1>Admin Dashboard</h1>

                <p className="admin-subtitle">
                    Manage users, counsellors and appointments.
                </p>

                {message && (
                    <div className="admin-message">
                        {message}
                    </div>
                )}

                {/* SUMMARY */}

                <div className="summary-container">

                    <div className="summary-card">
                        <h3>Total Users</h3>
                        <h1>{users.length}</h1>
                    </div>

                    <div className="summary-card">
                        <h3>Counsellors</h3>
                        <h1>{counsellors.length}</h1>
                    </div>

                    <div className="summary-card">
                        <h3>Appointments</h3>
                        <h1>{appointments.length}</h1>
                    </div>

                </div>


                {/* USERS */}

                <section className="admin-section">

                    <h2>👥 Users</h2>

                    <div className="table-container">

                        <table>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.map((user, index) => (
                                    <tr key={user.id}>

                                        <td>{index + 1}</td>

                                        <td>{user.name}</td>

                                        <td>{user.email}</td>

                                        <td>
                                            <span
                                                className={`role ${user.role}`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        <td>

                                            {user.role !== "admin" && (
                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        deleteUser(user.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </section>


                {/* COUNSELLORS */}

                <section className="admin-section">

                    <h2>👨‍🏫 Counsellors</h2>

                    <div className="cards-container">

                        {counsellors.map((counsellor) => (

                            <div
                                className="admin-card"
                                key={counsellor.id}
                            >

                                <h3>{counsellor.name}</h3>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {counsellor.email}
                                </p>

                                <p>
                                    <strong>Specialization:</strong>{" "}
                                    {counsellor.specialization}
                                </p>

                                <p>
                                    <strong>Experience:</strong>{" "}
                                    {counsellor.experience} years
                                </p>

                                    <p>
    <strong>Consultation Fee:</strong>{" "}
    ₹{Number(counsellor.consultation_fee).toLocaleString("en-IN")}
</p>

                                <p>
                                    {counsellor.bio}
                                </p>

                                {/* VERIFICATION STATUS */}

                                <p>
                                    <strong>Status:</strong>{" "}

                                    <span
                                        className={`status ${counsellor.verification_status}`}
                                    >
                                        {counsellor.verification_status}
                                    </span>
                                </p>


                                {/* APPROVE / REJECT BUTTONS */}

                                <div className="counsellor-actions">

                                    {counsellor.verification_status !== "approved" && (
                                        <button
                                            className="approve-button"
                                            onClick={() =>
                                                approveCounsellor(
                                                    counsellor.id
                                                )
                                            }
                                        >
                                            Approve
                                        </button>
                                    )}

                                    {counsellor.verification_status !== "rejected" && (
                                        <button
                                            className="reject-button"
                                            onClick={() =>
                                                rejectCounsellor(
                                                    counsellor.id
                                                )
                                            }
                                        >
                                            Reject
                                        </button>
                                    )}

                                    {counsellor.verification_status !== "pending" && (
                                        <button
                                            className="pending-button"
                                            onClick={() =>
                                                makePending(
                                                    counsellor.id
                                                )
                                            }
                                        >
                                            Make Pending
                                        </button>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                </section>


                {/* APPOINTMENTS */}

                <section className="admin-section">

                    <h2>📅 Appointments</h2>

                    <div className="cards-container">

                        {appointments.map((appointment) => (

                            <div
                                className="admin-card"
                                key={appointment.id}
                            >

                                <h3>
                                    Appointment #{appointment.id}
                                </h3>

                                <p>
                                    <strong>Student:</strong>{" "}
                                    {appointment.student_name}
                                </p>

                                <p>
                                    <strong>Counsellor:</strong>{" "}
                                    {appointment.counsellor_name}
                                </p>

                                <p>
                                    <strong>Date:</strong>{" "}
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
                                </p>

                                <p>
                                    <strong>Time:</strong>{" "}
                                    {appointment.appointment_time}
                                </p>

                                <span
                                    className={`status ${appointment.status}`}
                                >
                                    {appointment.status}
                                </span>

                            </div>

                        ))}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;
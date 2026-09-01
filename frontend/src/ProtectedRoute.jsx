import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // Login nahi hai
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Role match nahi karta
    if (role && user.role !== role) {
        if (user.role === "admin") {
            return <Navigate to="/admin-dashboard" replace />;
        }

        if (user.role === "counsellor") {
            return <Navigate to="/counsellor-dashboard" replace />;
        }

        if (user.role === "student") {
            return <Navigate to="/student-dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
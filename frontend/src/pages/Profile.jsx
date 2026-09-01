import { useEffect, useState } from "react";
import api from "../services/api";
import "./Profile.css";

function Profile() {

    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {

        const token = localStorage.getItem("token");

        try {

            const response = await api.get("/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProfile(response.data.profile);

        } catch (error) {

            console.log(
                "Profile Error:",
                error.response?.data || error
            );
        }
    };

    if (!profile) {
        return (
            <div className="profile-loading">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="profile-header">

                <div className="profile-avatar">
                    👤
                </div>

                <div>
                    <h1>My Profile</h1>
                    <p>
                        View and manage your career profile
                    </p>
                </div>

            </div>


            <div className="profile-grid">

                <div className="profile-info-card">

                    <span>🎓 Education</span>

                    <h3>
                        {profile.education || "Not added"}
                    </h3>

                </div>


                <div className="profile-info-card">

                    <span>🎯 Interests</span>

                    <h3>
                        {profile.interests || "Not added"}
                    </h3>

                </div>


                <div className="profile-info-card">

                    <span>💻 Skills</span>

                    <h3>
                        {profile.skills || "Not added"}
                    </h3>

                </div>

            </div>


            <div className="profile-about">

                <h2>Career Profile</h2>

                <p>
                    Your profile information helps CareerGuide
                    recommend suitable careers, courses, colleges
                    and career roadmaps for you.
                </p>

            </div>

        </div>
    );
}

export default Profile;
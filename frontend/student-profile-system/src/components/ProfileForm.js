import React, { useEffect, useState } from "react";
import api from "../services/api";

const ProfileForm = () => {
    const [profile, setProfile] = useState({
        name: "",
        contact: "",
        gender: "",
        university: "",
    });

    const userId = localStorage.getItem("userId"); // saved after login

    useEffect(() => {
        api.get(`/student-profiles/user/${userId}`)
            .then(res => setProfile(res.data))
            .catch(err => console.error(err));
    }, [userId]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post("/student-profiles/add", profile)
            .then(() => alert("Profile updated!"))
            .catch(err => alert("Error updating profile"));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>My Profile</h2>
            <input name="name" value={profile.name} onChange={handleChange} placeholder="Name" />
            <input name="contact" value={profile.contact} onChange={handleChange} placeholder="Contact" />
            <input name="gender" value={profile.gender} onChange={handleChange} placeholder="Gender" />
            <input name="university" value={profile.university} onChange={handleChange} placeholder="University" />
            <button type="submit">Save</button>
        </form>
    );
};

export default ProfileForm;

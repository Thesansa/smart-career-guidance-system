import React from "react";
import "./StudentProfile.css";
import leftImg from "../assets/left-student.png";
import rightImg from "../assets/right-student.png";

export default function StudentProfile() {
    return (
        <section className="student-page">
            <div className="hero">
                <h1 className="hero-title">Smart Career Guidance System</h1>
                <p className="hero-sub">Empowering your career with smart insights</p>
            </div>

            {/* decorative images placed behind the card */}
            <img src={leftImg} alt="" className="bg-left" aria-hidden="true" />
            <img src={rightImg} alt="" className="bg-right" aria-hidden="true" />

            <div className="profile-wrap">
                <div className="profile-card">
                    <h2>Student profile</h2>
                    <p className="muted">Edit your personal & academic details.</p>

                    <form className="profile-form" onSubmit={(e)=>e.preventDefault()}>
                        <label>
                            <span>Full name</span>
                            <input type="text" name="name" placeholder="Full name" />
                        </label>

                        <label>
                            <span>Email</span>
                            <input type="email" name="email" placeholder="Email" />
                        </label>

                        <label>
                            <span>University</span>
                            <input type="text" name="university" placeholder="University" />
                        </label>

                        <button className="btn-primary" type="submit">Save profile</button>
                    </form>
                </div>
            </div>
        </section>
    );
}

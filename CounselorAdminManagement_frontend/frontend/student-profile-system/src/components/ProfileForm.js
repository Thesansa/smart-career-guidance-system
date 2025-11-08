import React from "react";
import "./../App.css";

export default function ProfileForm(){
    return (
        <div className="container-centered">
            <div className="card profile-grid">
                <div>
                    <h2 className="h2">Student profile</h2>
                    <p className="muted">Edit your personal & academic details.</p>

                    <label>Full name</label>
                    <input className="input" placeholder="Full name" />

                    <label>Email</label>
                    <input className="input" placeholder="Email" />

                    <label>University</label>
                    <input className="input" placeholder="University" />

                    <div style={{marginTop:12}}>
                        <button className="btn-primary">Save profile</button>
                    </div>
                </div>

                <aside className="side-card">
                    <h3 className="h2">Quick info</h3>
                    <p className="muted">Role: STUDENT</p>
                    <p className="muted">You can view & edit your own profile.</p>
                </aside>
            </div>
        </div>
    );
}

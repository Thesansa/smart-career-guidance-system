import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfileForm from "./components/ProfileForm";
import Login from "./components/Login";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/profile" element={<ProfileForm />} />
            </Routes>
        </Router>
    );
}

export default App;

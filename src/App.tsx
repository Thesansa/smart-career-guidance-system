import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginForm from "./systems/authentication/LoginForm";
import SignUpForm from "./systems/authentication/SignUpForm";
import "./App.css";

function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Smart Career Guidance (Home)</h1>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
      </Routes>
    </div>
  );
}



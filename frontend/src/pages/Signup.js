import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/signup", form);
      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).join(", "));
      } else {
        setError(err.response?.data?.message || "Signup failed");
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name (20-60 characters)"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="address"
            placeholder="Address (max 400 characters)"
            value={form.address}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password (8-16 chars, 1 uppercase, 1 special char)"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button type="submit">Sign Up</button>
        </form>
        <p style={{ marginTop: 14 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

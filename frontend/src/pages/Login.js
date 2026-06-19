import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { setAuth } from "../auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      setAuth(res.data);
      const role = res.data.role;
      if (role === "ADMIN") navigate("/admin");
      else if (role === "STORE_OWNER") navigate("/store-owner");
      else navigate("/user");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit">Login</button>
        </form>
        <p style={{ marginTop: 14 }}>
          Not registered? <Link to="/signup">Sign up</Link>
        </p>
        <p style={{ fontSize: 12, color: "#777" }}>
          Default admin: admin@ratingapp.com / Admin@123
        </p>
      </div>
    </div>
  );
}

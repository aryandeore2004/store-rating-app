import React from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, getAuth } from "../auth";

export default function Navbar({ title }) {
  const navigate = useNavigate();
  const auth = getAuth();

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h2>{title}</h2>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <span>{auth?.name}</span>
        <button onClick={() => navigate("/change-password")} style={{ background: "#2980b9" }}>
          Change Password
        </button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

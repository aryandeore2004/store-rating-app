import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { getAuth } from "../auth";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const backPath =
    auth?.role === "ADMIN" ? "/admin" : auth?.role === "STORE_OWNER" ? "/store-owner" : "/user";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.put("/account/password", { oldPassword, newPassword });
      setSuccess("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors ? Object.values(errors).join(", ") : err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="card">
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password (8-16 chars, 1 uppercase, 1 special char)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button type="submit">Update Password</button>
        </form>
        <button className="link-button" style={{ marginTop: 12 }} onClick={() => navigate(backPath)}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

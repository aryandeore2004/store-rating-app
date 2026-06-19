import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function StoreOwnerDashboard() {
  const [data, setData] = useState({ averageRating: 0, raters: [] });

  useEffect(() => {
    api.get("/store-owner/dashboard").then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <Navbar title="Store Owner Dashboard" />
      <div className="container">
        <div className="stats-row">
          <div className="stat-box">
            <h1>{data.averageRating}</h1>
            <p>Average Rating</p>
          </div>
          <div className="stat-box">
            <h1>{data.raters.length}</h1>
            <p>Total Raters</p>
          </div>
        </div>

        <div className="card">
          <h3>Users Who Rated Your Store</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.raters.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.rating}</td>
                </tr>
              ))}
              {data.raters.length === 0 && (
                <tr><td colSpan="3">No ratings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

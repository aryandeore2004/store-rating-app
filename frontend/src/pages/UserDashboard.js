import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [message, setMessage] = useState("");

  const loadStores = async () => {
    const res = await api.get("/stores", {
      params: { name: name || undefined, address: address || undefined, sortBy, sortDir },
    });
    setStores(res.data);
  };

  useEffect(() => {
    loadStores();
    // eslint-disable-next-line
  }, [sortBy, sortDir]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadStores();
  };

  const submitRating = async (storeId, value) => {
    setMessage("");
    try {
      await api.post("/user/ratings", { storeId, value: Number(value) });
      setMessage("Rating saved!");
      loadStores();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save rating");
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  return (
    <div>
      <Navbar title="Browse Stores" />
      <div className="container">
        <div className="card">
          <form onSubmit={handleSearch} style={{ flexDirection: "row", flexWrap: "wrap", maxWidth: "100%" }}>
            <input placeholder="Search by name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Search by address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <button type="submit">Search</button>
          </form>
        </div>

        {message && <div className="success" style={{ marginBottom: 10 }}>{message}</div>}

        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort("name")}>Store Name</th>
              <th onClick={() => toggleSort("address")}>Address</th>
              <th>Overall Rating</th>
              <th>Your Rating</th>
              <th>Rate this Store</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.address}</td>
                <td>{s.overallRating || "No ratings yet"}</td>
                <td>{s.myRating ?? "Not rated"}</td>
                <td>
                  <select
                    defaultValue={s.myRating || ""}
                    onChange={(e) => e.target.value && submitRating(s.id, e.target.value)}
                  >
                    <option value="">Select 1-5</option>
                    {[1, 2, 3, 4, 5].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr><td colSpan="5">No stores found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

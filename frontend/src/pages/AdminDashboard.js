import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function AdminDashboard() {
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data));
  }, [tab]);

  return (
    <div>
      <Navbar title="Admin Dashboard" />
      <div className="container">
        <div className="stats-row">
          <div className="stat-box"><h1>{stats.totalUsers}</h1><p>Total Users</p></div>
          <div className="stat-box"><h1>{stats.totalStores}</h1><p>Total Stores</p></div>
          <div className="stat-box"><h1>{stats.totalRatings}</h1><p>Total Ratings</p></div>
        </div>

        <div className="tabs">
          <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>Users</button>
          <button className={tab === "stores" ? "active" : ""} onClick={() => setTab("stores")}>Stores</button>
          <button className={tab === "addUser" ? "active" : ""} onClick={() => setTab("addUser")}>Add User</button>
          <button className={tab === "addStore" ? "active" : ""} onClick={() => setTab("addStore")}>Add Store</button>
        </div>

        {tab === "users" && <UsersTab />}
        {tab === "stores" && <StoresTab />}
        {tab === "addUser" && <AddUserForm />}
        {tab === "addStore" && <AddStoreForm />}
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const load = async () => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    params.sortBy = sortBy;
    params.sortDir = sortDir;
    const res = await api.get("/admin/users", { params });
    setUsers(res.data);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [sortBy, sortDir]);

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortDir("asc"); }
  };

  return (
    <div className="card">
      <h3>Users</h3>
      <div className="filters">
        <input placeholder="Name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
        <button onClick={load}>Filter</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th onClick={() => toggleSort("name")}>Name</th>
            <th onClick={() => toggleSort("email")}>Email</th>
            <th onClick={() => toggleSort("address")}>Address</th>
            <th onClick={() => toggleSort("role")}>Role</th>
            <th>Rating (Store Owners)</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
              <td>{u.rating ?? "-"}</td>
            </tr>
          ))}
          {users.length === 0 && <tr><td colSpan="6">No users found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function StoresTab() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const load = async () => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    params.sortBy = sortBy;
    params.sortDir = sortDir;
    const res = await api.get("/admin/stores", { params });
    setStores(res.data);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [sortBy, sortDir]);

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortDir("asc"); }
  };

  return (
    <div className="card">
      <h3>Stores</h3>
      <div className="filters">
        <input placeholder="Name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <button onClick={load}>Filter</button>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => toggleSort("name")}>Name</th>
            <th onClick={() => toggleSort("email")}>Email</th>
            <th onClick={() => toggleSort("address")}>Address</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{s.rating || "No ratings yet"}</td>
            </tr>
          ))}
          {stores.length === 0 && <tr><td colSpan="4">No stores found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function AddUserForm() {
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "", role: "USER" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await api.post("/admin/users", form);
      setSuccess("User created successfully");
      setForm({ name: "", email: "", address: "", password: "", role: "USER" });
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors ? Object.values(errors).join(", ") : err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="card">
      <h3>Add New User</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name (20-60 characters)" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="address" placeholder="Address (max 400 characters)" value={form.address} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password (8-16, 1 uppercase, 1 special)" value={form.password} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="USER">Normal User</option>
          <option value="ADMIN">System Administrator</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

function AddStoreForm() {
  const [form, setForm] = useState({ name: "", email: "", address: "", ownerId: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const payload = { ...form, ownerId: form.ownerId ? Number(form.ownerId) : null };
      await api.post("/admin/stores", payload);
      setSuccess("Store created successfully");
      setForm({ name: "", email: "", address: "", ownerId: "" });
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors ? Object.values(errors).join(", ") : err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="card">
      <h3>Add New Store</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Store Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Store Email" value={form.email} onChange={handleChange} required />
        <input name="address" placeholder="Address (max 400 characters)" value={form.address} onChange={handleChange} required />
        <input name="ownerId" placeholder="Store Owner User ID (optional)" value={form.ownerId} onChange={handleChange} />
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button type="submit">Create Store</button>
      </form>
      <p style={{ fontSize: 12, color: "#777", marginTop: 8 }}>
        Tip: First create a user with role "Store Owner", note their ID from the Users tab, then link it here.
      </p>
    </div>
  );
}

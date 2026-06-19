import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import ChangePassword from "./pages/ChangePassword";
import { getAuth } from "./auth";

function PrivateRoute({ children, role }) {
  const auth = getAuth();
  if (!auth) return <Navigate to="/login" />;
  if (role && auth.role !== role) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/user"
          element={
            <PrivateRoute role="USER">
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/store-owner"
          element={
            <PrivateRoute role="STORE_OWNER">
              <StoreOwnerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Analytics from "../pages/Analytics";
import Profile from "../pages/Profile";

import Layout from "../components/layout/Layout";


// =============================
// Simple Auth Check
// =============================

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};


// =============================
// Protected Route
// =============================

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};


// =============================
// APP ROUTES
// =============================

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect */}
        <Route index element={<Navigate to="home" replace />} />

        <Route path="home" element={<Home />} />
        <Route path="chat" element={<Chat />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;

import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "../components/layout/Layout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Analytics from "../pages/Analytics";
import Profile from "../pages/Profile";

// Simple auth check
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const ProtectedLayout = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <Layout />;
};

const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },

  // Protected Routes
  {
    path: "/app",
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: <Home /> },
      { path: "chat", element: <Chat /> },
      { path: "analytics", element: <Analytics /> },
      { path: "profile", element: <Profile /> }
    ]
  }
]);

export default router;

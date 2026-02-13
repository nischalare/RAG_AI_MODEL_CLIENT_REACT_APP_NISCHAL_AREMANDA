/*
==========================================
AI RAG FRONTEND - API SERVICE LAYER
Centralized API calls with JWT handling
==========================================
*/

const BASE_URL = "http://127.0.0.1:8000";

/* ==========================================
   HELPER: Get Auth Headers
========================================== */

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/* ==========================================
   GENERIC API REQUEST HANDLER
========================================== */

const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
      ...options,
    });

    // Auto handle unauthorized
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
      throw new Error("Unauthorized");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

/* ==========================================
   AUTH APIs
========================================== */

export const registerUser = (payload) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginUser = (payload) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

/* ==========================================
   CHAT APIs
========================================== */

export const sendChatMessage = (payload) =>
  request("/chat", {
    method: "POST",
    body: JSON.stringify(payload),
  });

/* ==========================================
   ANALYTICS APIs
========================================== */

export const getAnalyticsSummary = () =>
  request("/analytics/summary", {
    method: "GET",
  });

export const getDetailedAnalytics = () =>
  request("/analytics/details", {
    method: "GET",
  });

/* ==========================================
   WEBSOCKET HELPER (Streaming)
========================================== */

export const createChatSocket = () => {
  const token = localStorage.getItem("token");

  return new WebSocket(
    `ws://127.0.0.1:8000/ws/chat?token=${token}`
  );
};

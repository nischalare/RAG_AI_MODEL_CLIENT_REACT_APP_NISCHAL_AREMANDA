import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import Button from "../common/Button";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState({
    total_sessions: 0,
    total_tokens: 0,
    total_cost: 0
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch(
          "http://127.0.0.1:8000/analytics/summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // If endpoint doesn't exist, don't logout
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }

        // Decode token
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          email: payload?.sub || "Unknown",
          role: payload?.role || "USER",
        });

      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return <Loader type="fullscreen" text="Loading profile..." />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>👤 Profile</h2>

        <div style={styles.section}>
          <p style={styles.label}>Email</p>
          <p style={styles.value}>{user?.email}</p>

          <p style={{ ...styles.label, marginTop: "15px" }}>Role</p>
          <span style={styles.roleBadge}>{user?.role}</span>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subTitle}>📊 Usage Analytics</h3>

          <div style={styles.statRow}>
            <span>Total Sessions</span>
            <span>{analytics.total_sessions}</span>
          </div>

          <div style={styles.statRow}>
            <span>Total Tokens Used</span>
            <span>{analytics.total_tokens}</span>
          </div>

          <div style={styles.statRow}>
            <span>Total Cost</span>
            <span>
              ${Number(analytics.total_cost).toFixed(4)}
            </span>
          </div>
        </div>

        <div style={styles.logoutContainer}>
          <Button onClick={handleLogout} variant="danger">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

/* Styles same as yours */


/* ========================== */
/* STYLES */
/* ========================== */

const styles = {
  container: {
    flex: 1,
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },

  card: {
    background: "#1f2937",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    color: "white",
    border: "1px solid #334155",
  },

  title: {
    marginBottom: "30px",
    fontSize: "24px",
    fontWeight: "600",
  },

  subTitle: {
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "500",
  },

  section: {
    marginBottom: "30px",
  },

  label: {
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "4px",
  },

  value: {
    fontSize: "16px",
    fontWeight: "500",
  },

  roleBadge: {
    background: "#2563eb",
    color: "white",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    display: "inline-block",
  },

  statRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    paddingBottom: "8px",
    borderBottom: "1px solid #334155",
    fontSize: "14px",
  },

  logoutContainer: {
    marginTop: "30px",
    textAlign: "center",
  },
};

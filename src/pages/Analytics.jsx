import { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      // ✅ If no token → redirect
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

        // ✅ Handle expired / invalid token
        if (!res.ok) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        const result = await res.json();
        setData(result);

      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate, token]);

  if (loading) {
    return <Loader type="fullscreen" text="Loading analytics..." />;
  }

  return (
    <Box sx={{ p: 4, color: "white" }}>

      <Typography variant="h4" fontWeight="bold" mb={4}>
        📊 Usage Analytics
      </Typography>

      <Grid container spacing={3}>

        {/* Total Tokens */}
        <Grid item xs={12} md={4}>
          <Paper sx={cardStyle}>
            <Typography variant="subtitle2" sx={labelStyle}>
              Total Tokens Used
            </Typography>
            <Typography variant="h5" fontWeight="bold" mt={1}>
              {data?.total_tokens ?? 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Total Cost */}
        <Grid item xs={12} md={4}>
          <Paper sx={cardStyle}>
            <Typography variant="subtitle2" sx={labelStyle}>
              Total AI Cost
            </Typography>
            <Typography variant="h5" fontWeight="bold" mt={1}>
              $
              {data?.total_cost
                ? Number(data.total_cost).toFixed(4)
                : "0.0000"}
            </Typography>
          </Paper>
        </Grid>

        {/* Total Sessions */}
        <Grid item xs={12} md={4}>
          <Paper sx={cardStyle}>
            <Typography variant="subtitle2" sx={labelStyle}>
              Total Sessions
            </Typography>
            <Typography variant="h5" fontWeight="bold" mt={1}>
              {data?.total_sessions ?? 0}
            </Typography>
          </Paper>
        </Grid>

      </Grid>

    </Box>
  );
};

export default Analytics;

/* ========================== */
/* Styles */
/* ========================== */

const cardStyle = {
  p: 3,
  backgroundColor: "#1f2937",
  borderRadius: 3,
  color: "white",
  transition: "0.2s ease",
  border: "1px solid #334155",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
    borderColor: "#2563eb",
  },
};

const labelStyle = {
  color: "#94a3b8",
};

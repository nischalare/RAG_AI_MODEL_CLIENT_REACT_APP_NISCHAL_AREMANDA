import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        flex: 1,
        px: { xs: 2, md: 6 },
        py: 6,
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* HERO */}
      <Box textAlign="center" mb={8}>
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: "linear-gradient(90deg, #2563eb, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Enterprise AI RAG Platform 🚀
        </Typography>

        <Typography
          variant="h6"
          sx={{ color: "#94a3b8", maxWidth: "700px", mx: "auto", mb: 4 }}
        >
          Secure JWT authentication, real-time streaming,
          token analytics, and enterprise-grade architecture.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#2563eb",
              px: 4,
              "&:hover": { backgroundColor: "#1d4ed8" },
            }}
            onClick={() => navigate("/app/chat")}
          >
            Start Chatting
          </Button>

          <Button
            variant="outlined"
            size="large"
            sx={{
              color: "white",
              borderColor: "#2563eb",
              px: 4,
              "&:hover": {
                borderColor: "#1d4ed8",
                backgroundColor: "rgba(37,99,235,0.1)",
              },
            }}
            onClick={() => navigate("/app/analytics")}
          >
            View Analytics
          </Button>
        </Box>
      </Box>

      {/* FEATURES */}
      <Grid container spacing={4}>
        {[
          {
            title: "🔐 Secure Authentication",
            desc: "JWT-based login with protected routes.",
          },
          {
            title: "⚡ Real-Time Streaming",
            desc: "ChatGPT-style streaming responses.",
          },
          {
            title: "📊 Token Analytics",
            desc: "Enterprise AI cost monitoring dashboard.",
          },
        ].map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                backgroundColor: "#1f2937",
                borderRadius: 4,
                color: "white",
                border: "1px solid #334155",
                transition: "0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
                  borderColor: "#2563eb",
                },
              }}
            >
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                {feature.desc}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;


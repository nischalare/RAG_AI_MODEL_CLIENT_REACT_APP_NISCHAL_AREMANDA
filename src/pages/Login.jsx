import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/app/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ prevent page reload

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        {
          email,
          password
        }
      );

      // ✅ Save token
      localStorage.setItem("token", res.data.access_token);

      // ✅ Redirect to protected layout route
      navigate("/app/home");

    } catch (err) {
      alert(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ p: 4, mt: 10 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

        {/* Wrap inside form for Enter key support */}
        <Box
          component="form"
          onSubmit={handleLogin}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            label="Email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            size="large"
            type="submit"   // ✅ allows Enter key submit
          >
            Login
          </Button>

          <Button onClick={() => navigate("/register")}>
            Create Account
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

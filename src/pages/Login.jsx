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
import { loginUser } from "../api/authService";

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
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      // ✅ Store JWT
      localStorage.setItem("token", data.access_token);

      // ✅ Redirect to protected route
      navigate("/app/home");

    } catch (err) {
      const errorMessage =
        Array.isArray(err.response?.data?.detail)
          ? err.response.data.detail.map(e => e.msg).join(", ")
          : err.response?.data?.detail || "Login failed";

      alert(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ p: 4, mt: 10 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

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
            type="submit"
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

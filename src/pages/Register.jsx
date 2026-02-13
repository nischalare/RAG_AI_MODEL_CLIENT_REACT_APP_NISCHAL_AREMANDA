import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isPasswordValid = form.password.length >= 6;
  const passwordsMatch = form.password === form.confirmPassword;

  const isValid = isEmailValid && isPasswordValid && passwordsMatch;

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isValid || loading) return;

    try {
      setLoading(true);
      setError("");

      await axios.post("http://127.0.0.1:8000/auth/register", {
        email: form.email,
        password: form.password
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 4,
            backgroundColor: "#1f2937",
            color: "white"
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 3 }}
          >
            Create Account 🚀
          </Typography>

          <Box
            component="form"
            onSubmit={handleRegister}
            display="flex"
            flexDirection="column"
            gap={3}
          >

            <TextField
              label="Email"
              fullWidth
              value={form.email}
              onChange={handleChange("email")}
              error={form.email !== "" && !isEmailValid}
              helperText={
                form.email !== "" && !isEmailValid
                  ? "Enter a valid email"
                  : ""
              }
              sx={textFieldStyle}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={form.password}
              onChange={handleChange("password")}
              error={form.password !== "" && !isPasswordValid}
              helperText={
                form.password !== "" && !isPasswordValid
                  ? "Minimum 6 characters required"
                  : ""
              }
              sx={textFieldStyle}
            />

            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              error={form.confirmPassword !== "" && !passwordsMatch}
              helperText={
                form.confirmPassword !== "" && !passwordsMatch
                  ? "Passwords do not match"
                  : ""
              }
              sx={textFieldStyle}
            />

            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={!isValid || loading}
              sx={{
                backgroundColor: "#2563eb",
                "&:hover": { backgroundColor: "#1d4ed8" }
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Register"
              )}
            </Button>

            <Button
              sx={{ color: "#94a3b8" }}
              onClick={() => navigate("/")}
            >
              Already have an account? Login
            </Button>

          </Box>
        </Paper>
      </Container>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" variant="filled">
          Registration Successful!
        </Alert>
      </Snackbar>
    </Box>
  );
}

/* ========================== */
/* TextField Dark Styling */
/* ========================== */

const textFieldStyle = {
  input: { color: "white" },
  label: { color: "#94a3b8" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#334155" },
    "&:hover fieldset": { borderColor: "#2563eb" },
    "&.Mui-focused fieldset": { borderColor: "#2563eb" }
  }
};

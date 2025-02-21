import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { registerUser } from "../services/api.js";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ username: "", email: "", password: "" });

  const validateForm = () => {
    let newErrors = { username: "", email: "", password: "" };
    let isValid = true;

    // ✅ Username Validation (Instagram Style)
    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (!/^[a-zA-Z][a-zA-Z0-9._]{0,29}$/.test(username)) {
      newErrors.username =
        "Username must start with a letter & contain only letters, numbers, underscores, and periods.";
      isValid = false;
    } else if (/\.\./.test(username)) {
      newErrors.username = "Username cannot have consecutive periods.";
      isValid = false;
    }

    // ✅ Email Validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // ✅ Password Validation (Instagram Style)
    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain at least one letter and one number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await registerUser({ username, email, password });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="main-register">
      <Container maxWidth="xs" className="register-container">
        <Typography variant="h4" style={{color: "white", marginBottom: "20px"}}>Social Feed - Sign Up</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
            sx={{
              input: { color: "white" }, // Text color inside input
              label: { color: "white" }, // Label color
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" }, // Border color
                "&:hover fieldset": { borderColor: "lightgray" }, // Hover effect
                "&.Mui-focused fieldset": { borderColor: "white" }, // Focus effect
              },
            }}
            autoComplete="off"
            required
          />
          <TextField
            label="email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              input: { color: "white" }, // Text color inside input
              label: { color: "white" }, // Label color
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" }, // Border color
                "&:hover fieldset": { borderColor: "lightgray" }, // Hover effect
                "&.Mui-focused fieldset": { borderColor: "white" }, // Focus effect
              },
            }}
            autoComplete="off"
            required
          />
          <TextField
            label="password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            sx={{
              input: { color: "white" }, // Text color inside input
              label: { color: "white" }, // Label color
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" }, // Border color
                "&:hover fieldset": { borderColor: "lightgray" }, // Hover effect
                "&.Mui-focused fieldset": { borderColor: "white" }, // Focus effect
              },
            }}
            autoComplete="off"
            required
          />
          <Button type="submit" variant="contained" fullWidth style={{marginTop: "20px"}}>
            Register
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body1" style={{color: "white", fontSize: "20px"}}>
            Already have an account?{" "}
            <Link to="/login" style={{ textDecoration: "none", color: "red" }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Register;

import React, { useEffect, useState, useContext } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { getProfile, loginUser } from "../services/api";
import AuthContext from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    email: "",
  });

  // Check if user is already logged in
  useEffect(() => {
    getProfile()
      .then((response) => {
        login(response.data.user); // Store user info

        navigate("/feed");
      })
      .catch(() => {}); // Ignore errors if not logged in
  }, []); //renders only once

  const validateForm = () => {
    let newErrors = { email: "", password: "" };
    let isValid = true;

    // Email Validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateForm()) return;
    try {
      const response = await loginUser({ email, password });
      login(response.data.user); // Store user info
      window.location.href = "/feed";
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  return (
    <div className="main-login">
      <Container maxWidth="xs" className="container">
        <Typography variant="h4" className="login-title">
          Social Feed
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              input: { color: "white" }, 
              label: { color: "white" }, 
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" }, 
                "&:hover fieldset": { borderColor: "lightgray" }, 
                "&.Mui-focused fieldset": { borderColor: "white" }, 
              },
            }}
            autoComplete="off"
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              input: { color: "white" }, 
              label: { color: "white" }, 
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" },
                "&:hover fieldset": { borderColor: "lightgray" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
            }}
            autoComplete="off"
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        <Typography variant="p" className="or-tag">
          ------------- Or -------------
        </Typography>
        <Box mt={2} textAlign="center">
          <Typography variant="body1" className="or-signup">
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "red" }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Login;

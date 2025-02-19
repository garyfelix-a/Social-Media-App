import React, { useEffect, useState, useContext } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { getProfile, loginUser } from "../services/api";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    getProfile()
      .then((response) => {
        login(response.data.user); // Store user info
        navigate("/feed");
      })
      .catch(() => {}); // Ignore errors if not logged in
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      login(response.data.user); // Store user info
      navigate("/feed");
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
      <Box mt={2} textAlign="center">
        <Typography variant="body1">
          Don't have an account?{" "}
          <Link to="/register" style={{ textDecoration: "none", color: "blue" }}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;


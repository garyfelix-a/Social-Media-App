import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { registerUser } from "../services/api.js";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ username, email, password });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4">Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth>
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;

import React, { useContext } from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';
const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Logout function to navigate to login page and clear user data from context
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar className="navbar-toolbar">
        <Typography variant="h6" className="navbar-logo">
          <Link to="/feed" className="navbar-link">
            Social Feed
          </Link>
        </Typography>

        <Box className="navbar-buttons">
          <Button className="nav-btn"  color="inherit" component={Link} to="/profile">
            Profile
          </Button>
          <Button className="nav-btn"  color="inherit" component={Link} to="/add-post">
            Add Post
          </Button>
          <Button className="nav-btn"  color="inherit" component={Link} to="/surf-post">
            Surf Posts
          </Button>
          <Button className="nav-btn"  color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};


export default Navbar;
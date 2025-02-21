import React, { useContext } from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';
const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
        {/* Social Feed Logo */}
        {/* <img src={logo} alt="logo" style={{width: "300px", height: "auto"}}/> */}
        <Typography variant="h6" className="navbar-logo">
          <Link to="/feed" className="navbar-link">
            Social Feed
          </Link>
        </Typography>

        {/* Navbar buttons (aligned left) */}
        <Box className="navbar-buttons">
          <Button className="nav-btn"  color="inherit" component={Link} to="/profile">
            Profile
          </Button>
          <Button className="nav-btn"  color="inherit" component={Link} to="/add-post">
            Add Post
          </Button>
          <Button className="nav-btn"  color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
    // <AppBar position="static" className="navbar">
    //   <Toolbar className="navbar-toolbar">
    //     <Typography variant="h6" className="navbar-logo" sx={{ flexGrow: 1 }}>
    //       <Link to="/feed" style={{ textDecoration: "none", color: "white" }}>
    //         Social Feed
    //       </Link>
    //     </Typography>

    //     {/* Navbar buttons */}
    //     <Button color="inherit" component={Link} to="/profile">
    //       Profile
    //     </Button>
    //     <Button color="inherit" to="/add-post">
    //       Add Post
    //     </Button>
    //     <Button color="inherit" onClick={handleLogout}>
    //       Logout
    //     </Button>
    //   </Toolbar>
    // </AppBar>
  );
};


export default Navbar;
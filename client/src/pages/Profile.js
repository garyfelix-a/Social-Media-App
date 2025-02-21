import React, { useEffect, useState } from "react";
import { getProfile } from "../services/api";
import { Container, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { deepPurple } from "@mui/material/colors";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState();

  // fetches use profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(); 
        setProfile(response.data); 
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile">
      <Container maxWidth="xs" className="profile-outer">
        <img src="" alt="" />
        <Container className="profile-inside">
          <Typography variant="h4" style={{ color: "white" }}>
            Profile
          </Typography>
          {profile ? (
            <div className="user-profile">
              <Avatar sx={{ bgcolor: deepPurple[500] }}>
                {profile.username[0]}
              </Avatar>
              <div style={{ marginLeft: "10px" }}>
                <Typography>Username: {profile.username}</Typography>
                <Typography>Email: {profile.email}</Typography>
              </div>
            </div>
          ) : (
            <p>No profile data found</p>
          )}
        </Container>
      </Container>
    </div>
  );
};

export default Profile;

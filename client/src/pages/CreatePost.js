import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api";
import AuthContext from "../context/AuthContext";
import { TextField, Button, Box, Typography } from "@mui/material";
import './CreatePost.css';

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  // Handle image changes when user uploads a new image
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  let userId = user.id;

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    //if no content or image is uploaded, then send alert message
    if (!content || !image) {
      alert("Please add an image and some content!");
      return;
    }

    const formData = new FormData();

    // Append the user ID, content, and image to the FormData object
    formData.append("user_id", userId);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    // Send the post request to the server
    try {
      const response = await createPost(formData);
      console.log("Post created successfully:", response.data);
      setContent("");
      setImage(null);
      navigate("/feed");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="create-post-main">
      <Box className="create-posts" sx={{ maxWidth: 500, margin: "auto", padding: 2 }}>
        <Typography variant="h5" style={{color: "white"}}>Create a New Post</Typography>

        <form onSubmit={handleSubmit} className="create-post-form">
          <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
          <Typography style={{color: "white"}}>Upload Photo :</Typography>
          <input style={{color: "white"}} type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <TextField
          className="post-content-input"
            label="Post Content"
            multiline
            rows={3}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ 
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

          <Button className="post-btn" type="submit" variant="contained" sx={{ marginTop: 2 }}>
            Post
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default CreatePost;

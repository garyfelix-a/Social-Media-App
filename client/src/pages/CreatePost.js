import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api";  // Backend API call
import AuthContext from "../context/AuthContext";
import { TextField, Button, Box, Typography } from "@mui/material";

const CreatePost = ({ setPosts }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  // ✅ Handle Image Upload
  const handleImageChange = (event) => {
    setImage(event.target.files[0]); 
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content || !image) {
      alert("Please add an image and some content!");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("content", content);
    formData.append("image", image);

    try {
      // ⬆️ Send data to backend
      const response = await createPost(formData);
      
      // 🆕 New post object from response
      const newPost = {
        id: response.data.postId,
        username: user.username,
        content,
        image_url: response.data.image_url, // Image URL from backend
        liked: false,
        total_likes: 0,
        total_comments: 0,
      };

      // 🔄 Update posts immediately in Feed
      setPosts((prevPosts) => [newPost, ...prevPosts]);

      // 🚀 Redirect to Feed page
      navigate("/feed");
    } catch (error) {
      console.error("❌ Error creating post:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", padding: 2 }}>
      <Typography variant="h5">Create a New Post</Typography>

      <form onSubmit={handleSubmit}>
        {/* 📸 Image Upload */}
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {/* 📝 Post Content */}
        <TextField
          label="Post Content"
          multiline
          rows={3}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ marginTop: 2 }}
        />

        {/* ➕ Post Button */}
        <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
          Post
        </Button>
      </form>
    </Box>
  );
};

export default CreatePost;

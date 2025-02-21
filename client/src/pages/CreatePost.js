import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api";
import AuthContext from "../context/AuthContext";
import { TextField, Button, Box, Typography } from "@mui/material";
import './CreatePost.css';

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // const [posts, setPosts] = useState([]);
  // const [formData, setFormData] = useState({});
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  // const handleImageChange = (event) => {
  //   setImage(event.target.files[0]);
  // };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  let userId = user.id;
  console.log("create post user id: ", userId);

  //  useEffect(() => {
  //     if (!userId) return; // ✅ Prevents execution if `userId` is null
  //     const fetchData = async () => {
  //       try {
  //         let data = [];
  //         const getFollowData = await getFollow(userId);
  //         getFollowData.data.forEach((follow) => {
  //           data.push(follow.id);
  //         });

  //         data = [userId, ...data];

  //         var payload = data.map((data) => fetchPosts(data, userId));

  //         let finalData = [];
  //         await Promise.all(payload)
  //           .then((results) => {
  //             results.forEach((result) => {
  //               if (result.data.length > 0) {
  //                 finalData = [...finalData, ...result.data];
  //               }
  //             });
  //           })
  //           .catch((error) =>
  //             console.error("❌ One of the promises failed:", error)
  //           );

  //         setPosts(finalData);
  //       } catch (error) {
  //         console.error("❌ Error fetching data:", error);
  //       }
  //     };

  //     fetchData();
  //   }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
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

    try {
      const response = await createPost(formData);
      console.log("Post created successfully:", response.data);
      setContent("");
      setImage(null);
      navigate("/feed");
    } catch (error) {
      console.error("Error creating post:", error);
    }

    // try {
    //   const response = await createPost(formData);

    //   // 🆕 New post object
    //   const newPost = {
    //     id: response.data.postId,
    //     username: user.username,
    //     content,
    //     image_url: response.data.image_url,
    //     liked: false,
    //     total_likes: 0,
    //     total_comments: 0,
    //   };

    //   setFormData(newPost);

    //   setPosts((prevPosts) => [newPost, ...prevPosts]);

    //   navigate("/feed");
    // } catch (error) {
    //   console.error("❌ Error creating post:", error);
    // }
  };

  return (
    <div className="create-post">
      <Box sx={{ maxWidth: 500, margin: "auto", padding: 2 }}>
        <Typography variant="h5">Create a New Post</Typography>

        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <TextField
            label="Post Content"
            multiline
            rows={3}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ marginTop: 2 }}
          />

          <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
            Post
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default CreatePost;

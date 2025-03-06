import React, { useContext, useEffect, useState } from "react";
import "./SurfPosts.css";
import {
  fetchComments,
  likePost,
  surfPosts,
  unlikePost,
} from "../services/api";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import {
  ChatBubbleOutline,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import AuthContext from "../context/AuthContext";
const SurfPosts = () => {
  let { getLoginUser } = useContext(AuthContext);

  let userId = getLoginUser();

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await unlikePost(postId, userId);
      } else {
        await likePost(postId, userId);
      }

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !isLiked,
                total_likes: isLiked
                  ? post.total_likes - 1
                  : post.total_likes + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Like/unlike error:", error);
    }
  };

  // Open Comments Popup & Fetch Comments
  const handleOpenComments = async (postId) => {
    setSelectedPost(postId);
    try {
      const res = await fetchComments(postId);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCloseComments = () => {
    setSelectedPost(null);
    setComments([]);
    setNewComment("");
  };

  // Add New Comment
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const res = await addComment(selectedPost, userId, newComment);

        // Update UI instantly with new comment
        const newCommentData = {
          id: res.data.insertId, // Assuming backend returns insertId
          username: "You",
          comment: newComment,
        };
        setComments((prev) => [newCommentData, ...prev]);
        setNewComment("");

        // Update total comments count in post
        setPosts((prev) =>
          prev.map((post) =>
            post.id === selectedPost
              ? { ...post, total_comments: post.total_comments + 1 }
              : post
          )
        );
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await surfPosts();
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching surf posts : ", error);
      }
    };

    fetchData();
  }, []);

  console.log(posts);

  return (
    <div>
      <Typography>Explore Posts</Typography>
      {posts.map((post) => (
        <Card key={post.id}>
          <Typography>{post.username}</Typography>
          <CardMedia
            component="img"
            height="300"
            image={`http://localhost:8081${post.image_url}`}
            alt="post image"
          />
          <CardContent>
            <Typography>{post.content}</Typography>
          </CardContent>

          <CardActions>
            {/* Like Button */}
            <IconButton onClick={() => handleLike(post.id, post.liked)}>
              {post.liked ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <Typography>{post.total_likes}</Typography>

            {/* Comment Button */}
            <IconButton onClick={() => handleOpenComments(post.id)}>
              <ChatBubbleOutline />
            </IconButton>
            <Typography>{post.total_comments}</Typography>
          </CardActions>
        </Card>
      ))}

      <Dialog open={Boolean(selectedPost)} onClose={handleCloseComments}>
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          {comments.length === 0 ? (
            <Typography>No comments yet.</Typography>
          ) : (
            comments.map((comment) => (
              <Typography key={comment.id}>
                <strong>{comment.username}:</strong> {comment.comment}
              </Typography>
            ))
          )}

          <TextField
            label="Add a comment"
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddComment}>Post</Button>
          <Button onClick={handleCloseComments}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SurfPosts;

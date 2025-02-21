import React, { useContext, useEffect, useState } from "react";
import "./Feed.css";
import {
  fetchPosts,
  likePost,
  unlikePost,
  fetchComments,
  addComment,
  fetchSuggestedUsers,
  followUser,
  getFollow,
} from "../services/api.js";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
} from "@mui/icons-material";
import AuthContext from "../context/AuthContext.js";

const Feed = () => {
  let { getLoginUser } = useContext(AuthContext);

  let userId = getLoginUser();

  console.log("user id: ", userId);

  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch posts and suggested users on load
  useEffect(() => {
    if (!userId) return; 
    const fetchData = async () => {
      try {
        let data = [];
        const getFollowData = await getFollow(userId);
        getFollowData.data.forEach((follow) => {
          data.push(follow.id);
        });

        data = [userId, ...data];

        var payload = data.map((data) => fetchPosts(data, userId));

        let finalData = [];
        // Fetch posts concurrently and combine them together into a single payload
        await Promise.all(payload)
          .then((results) => {
            results.forEach((result) => {
              if (result.data.length > 0) {
                finalData = [...finalData, ...result.data];
              }
            });
          })
          .catch((error) =>
            console.error("One of the promises failed:", error)
          );

        setPosts(finalData);
        const suggestedRes = await fetchSuggestedUsers(userId);
        setSuggestedUsers(suggestedRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]); 

  // Handle Like/Unlike
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

  // Close Comments Popup
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

  // Follow a User & Refresh Feed
  const handleFollow = async (followingId) => {
    await followUser(userId, followingId);
    window.location.reload();

    const updatedPosts = await fetchPosts(userId);
    setPosts(updatedPosts.data);

    const updatedSuggestedUsers = await fetchSuggestedUsers(userId);
    setSuggestedUsers(updatedSuggestedUsers.data);
  };

  return (
    <div className="main-feed">
      {/* Suggested Users Section */}
      {suggestedUsers !== undefined && suggestedUsers.length > 0 && (
        <div className="suggested-users">
          <Typography variant="h5">Suggested People</Typography>
          {suggestedUsers.map((user) => (
            <Button
              className="follow-btn"
              color="inherit"
              key={user.id}
              onClick={() => handleFollow(user.id)}
            >
              Follow {user.username}
            </Button>
          ))}
        </div>
      )}

      {/* Posts Section */}
      <div className="post-section">
        {posts.length === 0 ? (
          <Typography variant="h6" align="center">
            No posts available. Follow people to see posts.
          </Typography>
        ) : (
          posts.map((post) => (
            <Card
              key={post.id}
              sx={{ margin: "20px", padding: "10px" }}
              className="feed-card"
            >
              <Typography variant="h6">{post.username}</Typography>
              <CardMedia
                component="img"
                height="300"
                style={{borderBottom: "1px solid black", padding: "20px 0px"}}
                image={`http://localhost:8081${post.image_url}`}
                alt="Post image"
              />
              <CardContent>
                <Typography variant="body2" style={{fontSize: "18px"}}>
                  <span style={{color: "red"}}>{post.username}</span> : {post.content}
                </Typography>
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
          ))
        )}
      </div>

      {/* Comments Popup */}
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

          {/* Add a Comment Input */}
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

export default Feed;

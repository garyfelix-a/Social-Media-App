import React, { useEffect, useState } from "react";
import {
  fetchPosts,
  likePost,
  unlikePost,
  fetchComments,
  addComment,
  fetchSuggestedUsers,
  followUser,
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

const Feed = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchPosts(userId).then((res) => setPosts(res.data));
    fetchSuggestedUsers(userId).then((res) => setSuggestedUsers(res.data));
  }, [userId]);

  //Like or unlike a post
  const handleLike = async (postId, isLiked) => {
    if(isLiked){
        await unlikePost(postId, userId);
    }
    else{
        await likePost(postId, userId);
    }

    fetchPosts(userId).then((res) => setPosts(res.data)); // refresh posts
  }

  //open comments popup modal
  const handleOpenComments = async (postId) => {
    setSelectedPost(postId);
    fetchComments(postId).then((res) => setComments(res.data));
  }

  //close comments popup modal
  const handleCloseComments = () => {
    setSelectedPost(null);
    setComments([]);
  }

  //submit comment
  const handleAddComment = async () => {
    if(newComment.trim()){
        await addComment(selectedPost, userId, newComment);
        setNewComment("");
        fetchComments(selectedPost).then((res) => setComments(res.data)); // refresh comments
    }
  }

  //follow a user
  const handleFollow = async (followingId) => {
    await followUser(userId, followingId);
    fetchSuggestedUsers(userId).then((res) => setSuggestedUsers(res.data)); // refresh suggested users
    fetchPosts(userId).then((res) => setPosts(res.data)); //refresh posts
  };

  return (
    <div>
      <Typography variant="h4" align="center">
        Social Media Feed
      </Typography>

      {/* Suggested Users Section */}
      {suggestedUsers.length > 0 && (
        <div>
          <Typography variant="h6">Follow People</Typography>
          {suggestedUsers.map((user) => (
            <Button key={user.id} onClick={() => handleFollow(user.id)}>
              Follow {user.username}
            </Button>
          ))}
        </div>
      )}

      {/* posts section */}
      {posts.length === 0 ? (
        <Typography variant="h6" align="center">
          No posts available. Follow people to see posts.
        </Typography>
      ) : (
        posts.map((post) => (
          <Card key={post.id} sx={{ margin: "20px", padding: "10px" }}>
            <Typography variant="h6">{post.username}</Typography>
            <CardMedia
              component="img"
              height="200"
              image={post.image_url}
              alt="Post image"
            />
            <CardContent>
              <Typography variant="body2">{post.content}</Typography>
            </CardContent>
            <CardActions>
              <IconButton onClick={() => handleLike(post.id, post.liked)}>
                {post.liked ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
              <Typography>{post.total_likes}</Typography>

              <IconButton onClick={() => handleOpenComments(post.id)}>
                <ChatBubbleOutline />
              </IconButton>
              <Typography>{post.total_comments}</Typography>
            </CardActions>
          </Card>
        ))
      )}

      {/* Comments Popup */}
      <Dialog open={Boolean(selectedPost)} onClose={handleCloseComments}>
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          {comments.map((comment) => (
            <Typography key={comment.id}>{comment.username}: {comment.comment}</Typography>
          ))}
          <TextField
            label="Add a comment"
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
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

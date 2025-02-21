import React, { useContext, useEffect, useState } from "react";
import {
  fetchPosts,
  likePost,
  unlikePost,
  fetchComments,
  addComment,
  fetchSuggestedUsers,
  followUser,getFollow
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
import { Favorite, FavoriteBorder, ChatBubbleOutline } from "@mui/icons-material";
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

  // 🔥 Fetch Posts & Suggested Users on Load
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {

  //       var data = []
  //       const getFollowData = await getFollow(userId);
  //       getFollowData.data.forEach(follow => {
  //         data.push(follow.id);
  //       });

  //       data = [userId, ...data];
  //       console.log(data);

  //       var payload = data.map((data) =>{
  //           return fetchPosts(data,userId);
  //       });

  //       console.log(payload);

  //       let finalData = [];

  //       await Promise.all(payload).then((results) => {
  //         console.log("🎉 All tasks completed:", results);
  //         if(results.length > 0){

  //           results.forEach((result) => {
  //             if(result.data.length > 0){
  //               finalData = [...finalData,...result.data];
  //             }
  //           })

  //         }
  //       })
  //       .catch((error) => {
  //         console.error("❌ One of the promises failed:", error);
  //       });
  //       console.log("finalData",finalData);
  //       setPosts(finalData);

  //       const suggestedRes = await fetchSuggestedUsers(userId);
  //       setSuggestedUsers(suggestedRes.data);
  //     } catch (error) {
  //       console.error("❌ Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, [userId]);

  useEffect(() => {
    if (!userId) return; // ✅ Prevents execution if `userId` is null
  
    
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
        await Promise.all(payload)
          .then((results) => {
            results.forEach((result) => {
              if (result.data.length > 0) {
                finalData = [...finalData, ...result.data];
              }
            });
          })
          .catch((error) => console.error("❌ One of the promises failed:", error));
  
        setPosts(finalData);
        const suggestedRes = await fetchSuggestedUsers(userId);
        setSuggestedUsers(suggestedRes.data);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [userId]); // ✅ Only runs if `userId` is not null
  

  // ✅ Handle Like/Unlike
  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await unlikePost(postId, userId);
      } else {
        await likePost(postId, userId);
      }

      // 🔄 Update UI instantly
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !isLiked,
                total_likes: isLiked ? post.total_likes - 1 : post.total_likes + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error("❌ Like/unlike error:", error);
    }
  };

  // ✅ Open Comments Popup & Fetch Comments
  const handleOpenComments = async (postId) => {
    setSelectedPost(postId);
    try {
      const res = await fetchComments(postId);
      setComments(res.data);
    } catch (error) {
      console.error("❌ Error fetching comments:", error);
    }
  };

  // ✅ Close Comments Popup
  const handleCloseComments = () => {
    setSelectedPost(null);
    setComments([]);
    setNewComment("");
  };

  // ✅ Add New Comment
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const res = await addComment(selectedPost, userId, newComment);

        // 🔄 Update UI instantly with new comment
        const newCommentData = {
          id: res.data.insertId, // Assuming backend returns insertId
          username: "You",
          comment: newComment,
        };
        setComments((prev) => [newCommentData, ...prev]);
        setNewComment("");

        // 🔄 Update total comments count in post
        setPosts((prev) =>
          prev.map((post) =>
            post.id === selectedPost
              ? { ...post, total_comments: post.total_comments + 1 }
              : post
          )
        );
      } catch (error) {
        console.error("❌ Error adding comment:", error);
      }
    }
  };

  // ✅ Follow a User & Refresh Feed
  const handleFollow = async (followingId) => {
    await followUser(userId, followingId);

    // 🔄 Refresh feed after following
    const updatedPosts = await fetchPosts(userId);
    setPosts(updatedPosts.data);

    const updatedSuggestedUsers = await fetchSuggestedUsers(userId);
    setSuggestedUsers(updatedSuggestedUsers.data);
  };

  return (
    <div>
      <Typography variant="h4" align="center">
        Social Media Feed
      </Typography>

      {/* Suggested Users Section */}
      {suggestedUsers!==undefined && suggestedUsers.length > 0 && (
        <div>
          <Typography variant="h6">Follow People</Typography>
          {suggestedUsers.map((user) => (
            <Button key={user.id} onClick={() => handleFollow(user.id)}>
              Follow {user.username}
            </Button>
          ))}
        </div>
      )}

      {/* Posts Section */}
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

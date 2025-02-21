import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081/api/",
  withCredentials: true,
});

// const API_URL = "http://localhost:8081/api";

//AUTH ENDPOINTS

//register user
export const registerUser = async (userData) => {
  return await API.post("/auth/register", userData);
};

//login user
export const loginUser = async (userData) => {
  return await API.post("/auth/login", userData);
};

//logout user
export const logoutUser = async () => {
  return await API.get("/auth/logout");
};

//get user profile
export const getProfile = async () => {
  return await API.get("/auth/profile");
};

//POST ENDPOINTS

//Fetch posts of followed users
export const fetchPosts = async (userId,own_id) => {
  return await API.get(`posts/${userId}/${own_id}`);
};

//Like a post

export const likePost = async (postId, userId) => {
  return await API.post(`/likes`, { post_id: postId, user_id: userId });
};


//Unlike a post
export const unlikePost = async (postId, userId) => {
  return await API.delete("/likes", {
    data: { post_id: postId, user_id: userId }, // Send data in the request body for DELETE
  });
};

//Fetch comments for a post
export const fetchComments = async (postId) => {
  return await API.get(`comments/${postId}`);
};

//Add a comment to a post
export const addComment = async (postId, userId, comment) => {
  return await API.post(`comments/add`, {
    postId: postId,
    userId: userId,
    comment: comment,
  });
};

//Fetch suggested users to follow
export const fetchSuggestedUsers = async (userId) => {
  return await API.get(`follows/suggested/${userId}`);
};

//Follow a user
// export const followUser = async (followerId, followingId) => {
//   return await API.post(`follows/${followerId}/${followingId}`);
// };

export const followUser = async (followerId, followingId) => {
  return await API.post(`/follows`, { follower_id: followerId, following_id: followingId });
};

export const getFollow = async (useId) => {
  return await API.get(`/follows/${useId}`);
};

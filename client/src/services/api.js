import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8081/api/auth/",
    withCredentials: true,
});

// const API_URL = "http://localhost:8081/api";

//register user
export const registerUser = async (userData) => {
    return await API.post("/register", userData);
};

//login user
export const loginUser = async (userData) => {
    return await API.post("/login", userData);
};

//logout user
export const logoutUser = async () => {
    return await API.get("/logout");
};

//get user profile
export const getProfile = async () => {
    return await API.get("/profile");
};

import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user on component mount and update when user is logged in or out.
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/auth/me", {
          withCredentials: true,
        });
        setUser(response.data.user); 
      } catch (error) {
        setUser(null);
        console.log(error);
      }
    };
  
    fetchUser();
  }, []);

  console.log("user :",user);

  // Login user
  const login = (userData) => {
    setUser(userData);
  };

  // Get the logged in user ID. Returns null if no user is logged in.
  const getLoginUser = () => {
    return user ? user.id : null;
  }

  // Logout user
  const logout = async () => {
    await axios.post(
      "http://localhost:8081/api/auth/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
    navigate("/login");
  };

  return (
    // Provide the AuthContext with the current user state and the functions to interact with it.
    <AuthContext.Provider value={{ user, login, getLoginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;
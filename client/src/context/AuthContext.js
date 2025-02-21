import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8081/api/auth/me", { withCredentials: true })
  //     .then((response) => setUser(response.data.user))
  //     .catch(() => setUser(null));
  // }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/auth/me", {
          withCredentials: true,
        });
        setUser(response.data.user); // ✅ Update state only if necessary
      } catch (error) {
        setUser(null);
        console.log(error);
      }
    };
  
    fetchUser();
  }, []);

  console.log("user :",user);

  const login = (userData) => {
    setUser(userData);
    // window.location.reload();
  };

  const getLoginUser = () => {
    return user ? user.id : null;
  }

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
    <AuthContext.Provider value={{ user, login, getLoginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;
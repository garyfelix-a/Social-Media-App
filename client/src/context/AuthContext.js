import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8081/auth/me", { withCredentials: true })
      .then((response) => setUser(response.data.user))
      .catch(() => setUser(null));
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await axios.get(
      "http://localhost:8081/auth/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

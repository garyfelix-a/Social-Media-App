import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Feed from "./pages/Feed";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import CreatePost from "./pages/CreatePost";
import SurfPosts from "./pages/SurfPosts";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/add-post"
              element={<CreatePost />}
            />
            <Route
              path="/surf-post"
              element={<SurfPosts />}
            />
            <Route
              path="/profile"
              element={<Profile />}
            />
            <Route
              path="/feed"
              element={
                <>
                  <Navbar />
                  <Feed />
                </>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
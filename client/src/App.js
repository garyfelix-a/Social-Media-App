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

// import React, { useContext, useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Feed from "./pages/Feed";
// import CreatePost from "./pages/CreatePost";
// import Navbar from "./components/Navbar";
// import AuthContext, { AuthProvider } from "./context/AuthContext";
// import { fetchPosts } from "./services/api"; // Function to fetch posts from backend

// function App() {
//   const { user, getLoginUser } = useContext(AuthContext);
//   const userId = user? getLoginUser() : null;

//   // ✅ Manage posts state here
//   const [posts, setPosts] = useState([]);

//   // ✅ Fetch posts when component mounts
//   useEffect(() => {
//     if (userId) {
//       fetchPosts(userId)
//         .then((data) => setPosts(data))
//         .catch(console.error);
//     }
//   }, [userId]);

//   return (
//     <AuthProvider>
//       <Router>
//         <Navbar />
//         <Routes>
//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />

//           <Route element={<ProtectedRoute />}>
//             {/* ✅ Pass `posts` and `setPosts` to Feed */}
//             <Route
//               path="/feed"
//               element={<Feed posts={posts} setPosts={setPosts} />}
//             />

//             {/* ✅ Pass `setPosts` to CreatePost */}
//             <Route
//               path="/add-post"
//               element={<CreatePost setPosts={setPosts} />}
//             />
//           </Route>

//           <Route path="*" element={<Navigate to="/login" />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

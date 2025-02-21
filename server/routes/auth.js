import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser());

// Register User
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User Registered Successfully" });
    }
  );
});

//Login User
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(400).json({ error: "User not found" });

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Invalid Credentials" });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.cookie("token", token, {
        httpOnly: true,  // Prevents JavaScript access
        secure: false, // Use true in production (HTTPS required)
        sameSite: "Strict",  // CSRF protection
        maxAge: 3600000,  // 1 hour
      });

      res.json({ message: "Login Successful" });
    }
  );
});

//Logout user
router.post("/logout", (req, res) => {
  if(!req.cookies.token){
    return res.status(400).json({ message: "No token found" });
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });
  res.json({ message: "Logged out successfully" });
})

//fetches user details from the database
router.get("/profile", (req, res) => {
  const token = req.cookies.token; // Read token from cookies
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    db.query(
      "SELECT id, username, email FROM users WHERE id = ?",
      [decoded.id],
      (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0)
          return res.status(404).json({ error: "User not found" });

        res.json(results[0]); // Return user data
      }
    );
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

//to check if user is authenticated or not
router.get("/me", (req, res) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    res.json({ user: { id: decoded.id } }); // Return user info 
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;

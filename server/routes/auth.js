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
      if (err) return res.status(500).json({ error: "Server Error" });
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
        secure: true, // Use true in production (HTTPS required)
        sameSite: "strict",  // CSRF protection
        maxAge: 3600000,  // 1 hour
      });

      res.json({ message: "Login Successful" });

      // res.json({
      //   token,
      //   user: { id: user.id, username: user.username, email: user.email },
      // });
    }
  );
});

export default router;

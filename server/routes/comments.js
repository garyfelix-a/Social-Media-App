import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Post a comment
router.post("/add", (req, res) => {
  const { post_id, user_id, comment } = req.body;

  // Ensure comment text is provided
  if (!comment) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  db.query(
    "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)", // ✅ Fixed here
    [post_id, user_id, comment],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Server Error" });
      res.json({ message: "Comment added", commentId: result.insertId });
    }
  );
});

// Get comments for a post
router.get("/:post_id", (req, res) => {
  const { post_id } = req.params;

  db.query(
    "SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at DESC",
    [post_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Server error" });
      }
      res.json(results);
    }
  );
});

export default router;

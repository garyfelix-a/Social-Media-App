import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Like a post
router.post("/", (req, res) => {
  console.log("🟢 Received Like Request:", req.body);

  const { post_id, user_id } = req.body;

  if (!post_id || !user_id) {
    console.error("❌ Missing post_id or user_id");
    return res.status(400).json({ error: "post_id and user_id are required" });
  }

  // Check if the user has already liked the post
  const checkQuery = "SELECT * FROM likes WHERE post_id = ? AND user_id = ?";
  db.query(checkQuery, [post_id, user_id], (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ error: "Database Error" });
    }

    if (result.length > 0) {
      console.warn("⚠️ Already Liked");
      return res.status(400).json({ error: "Already liked" });
    }

    // Insert like into the database
    const insertQuery = "INSERT INTO likes (post_id, user_id) VALUES (?, ?)";
    db.query(insertQuery, [post_id, user_id], (err, result) => {
      if (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ error: "Database Error" });
      }

      console.log("✅ Post Liked Successfully");
      res.json({ message: "Post liked successfully" });
    });
  });
});

// Unlike a post

router.delete("/", (req, res) => {
  console.log("🟠 Received Unlike Request:", req.body);

  const { post_id, user_id } = req.body; // Use req.body for DELETE with JSON payload

  if (!post_id || !user_id) {
    console.error("❌ Missing post_id or user_id");
    return res.status(400).json({ error: "post_id and user_id are required" });
  }

  const deleteQuery = "DELETE FROM likes WHERE post_id = ? AND user_id = ?";
  db.query(deleteQuery, [post_id, user_id], (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ error: "Database Error" });
    }

    if (result.affectedRows === 0) {
      console.warn("⚠️ No Like Found to Remove");
      return res.status(400).json({ error: "Like not found" });
    }

    console.log("✅ Post Unliked Successfully");
    res.json({ message: "Post unliked successfully" });
  });
});


export default router;
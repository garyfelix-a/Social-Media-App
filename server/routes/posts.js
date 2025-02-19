import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Create a new post
router.post("/create", (req, res) => {
  const { user_id, content, image_url } = req.body;

  db.query(
    "INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)",
    [user_id, content, image_url],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Server error" });
      res.json({ message: "Post created successfully" });
    }
  );
});

//Get all posts sorted by popularity (likes + comments)
router.get("/", (req, res) => {
  const query = `
        SELECT 
      posts.id, posts.content, posts.user_id, 
      COUNT(likes.id) AS total_likes 
   FROM posts 
   LEFT JOIN likes ON posts.id = likes.post_id 
   GROUP BY posts.id
    `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Server Error" });
    res.json(results);
  });
});

//delete a post
router.delete("/:post_id", (req, res) => {
  const { post_id } = req.params;

  // First, delete related likes and comments to maintain data integrity
  db.query("DELETE FROM likes WHERE post_id = ?", [post_id], (err) => {
    if (err) return res.status(500).json({ error: "Error deleting likes" });

    db.query("DELETE FROM comments WHERE post_id = ?", [post_id], (err) => {
      if (err)
        return res.status(500).json({ error: "Error deleting comments" });

      // Finally, delete the post
      db.query("DELETE FROM posts WHERE id = ?", [post_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error deleting post" });

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Post not found" });
        }

        res.json({ message: "Post deleted successfully" });
      });
    });
  });
});

export default router;



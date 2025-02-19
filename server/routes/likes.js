import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Like a post
router.post("/:post_id/:user_id", (req, res) => {
  const { post_id, user_id } = req.params;

  // Check if the user already liked the post
  db.query(
    "SELECT * FROM likes WHERE post_id = ? AND user_id = ?",
    [post_id, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.length > 0) {
        return res.status(400).json({ error: "Already liked" });
      }

      // Insert into likes table
      db.query(
        "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
        [post_id, user_id],
        (err) => {
          if (err) return res.status(500).json({ error: "Error liking post" });

          // ✅ Update likes count in the posts table
          db.query(
            "UPDATE posts SET likes = likes + 1 WHERE id = ?",
            [post_id],
            (err) => {
              if (err)
                return res
                  .status(500)
                  .json({ error: "Error updating like count" });
              res.json({ message: "Post liked successfully" });
            }
          );
        }
      );
    }
  );
});


router.delete("/:post_id/:user_id", (req, res) => {
  const { post_id, user_id } = req.params;

  db.query(
    "DELETE FROM likes WHERE post_id = ? AND user_id = ?",
    [post_id, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.affectedRows === 0) {
        return res.status(400).json({ error: "Like not found" });
      }

      // ✅ Update likes count in the posts table
      db.query(
        "UPDATE posts SET likes = likes - 1 WHERE id = ?",
        [post_id],
        (err) => {
          if (err)
            return res.status(500).json({ error: "Error updating like count" });
          res.json({ message: "Post unliked successfully" });
        }
      );
    }
  );
});

export default router;

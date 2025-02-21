import express from "express";
import db from "../config/db.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-"+file.originalname);
  },
});

const upload = multer({ storage });

// Create a new post
router.post("/create", upload.single("image"), (req, res) => {
  const { user_id, content } = req.body;
  const image_url = `/uploads/${req.file.filename}`;

  db.query(
    "INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)",
    [user_id, content, image_url],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Server error" });
      res.json({ postId: result.insertId, image_url});
    }
  );
});

//Get all posts sorted by popularity (likes + comments)
router.get("/", (req, res) => {
  const query = `
        SELECT posts.id, posts.content, posts.user_id, 
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

//Get posts from followed users
router.get("/:user_id/:own_id", (req, res) => {
  const { user_id,own_id } = req.params;

  const query = `
  SELECT posts.*, users.username, 
  (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS total_likes,
  (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS total_comments,
  EXISTS (SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ${own_id}) AS liked
  FROM posts
  JOIN users ON posts.user_id = users.id
  WHERE posts.user_id = ${user_id} OR posts.user_id IN (SELECT following_id FROM follows WHERE user_id = ${user_id});
  `;

  db.query(query, undefined, (err, results) => {
    if (err) return res.status(500).json({ error: err });
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




import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const query = `
        SELECT posts.*, users.username,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS total_likes,
        (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS total_comments
        FROM posts
        JOIN users ON posts.user_id = users.id
        ORDER BY posts.created_at DESC;
    `;

    db.query(query, (err, results) => {
        if(err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

export default router;
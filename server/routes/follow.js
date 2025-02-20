import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Follow a user
// router.post("/:follower:id/:following_id", (req, res) => {
//     const { follower_id, following_id  } = req.params;

//     db.query("INSERT INTO follows (follower_id, following_id) VALUES (?, ?)",
//         [follower_id, following_id],
//         (err, result) => {
//             if(err) return res.status(500).json({ error: "Database Error" });
//             res.json({ message: "Followed Successfully" });
//         }
//     );
// });

router.post("/", (req, res) => {
  const { follower_id, following_id } = req.body;

  if (!follower_id || !following_id) {
    return res
      .status(400)
      .json({ error: "Both follower_id and following_id are required" });
  }

  const query = "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)";

  db.query(query, [follower_id, following_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Server error" });

    res.json({ message: "User followed successfully" });
  });
});

// Unfollow a user
router.delete("/:follower_id/:following_id", (req, res) => {
  const { follower_id, following_id } = req.params;

  db.query(
    "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
    [follower_id, following_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database Error" });
      if (result.affectedRows === 0)
        return res.status(400).json({ error: "Not Following" });

      res.json({ message: "Unfollowed Successfully" });
    }
  );
});

// Get users to follow (excluding already followed)
router.get("/suggested/:user_id", (req, res) => {
  const { user_id } = req.params;

  const query = `
        SELECT id, username FROM users
        WHERE id NOT IN 
        (SELECT following_id FROM follows WHERE follower_id = ?) 
        AND id <> ?
    `;

  db.query(query, [user_id, user_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database Error" });
    res.json(results);
  });
});

//Get followed users
router.get("/:user_id", (req, res) => {
  const { user_id } = req.params;

  const query = `
      SELECT u.id, u.username 
      FROM users u 
      JOIN follows f ON u.id = f.following_id 
      WHERE f.follower_id = ?;
    `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Server error" });
    }
    res.json(results);
  });
});

export default router;

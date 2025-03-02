import React, { useEffect, useState } from "react";
import { surfPosts } from "../services/api";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
const SurfPosts = () => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await surfPosts();
                setPosts(res.data);
            } catch (error) {
                console.error("Error fetching surf posts : ", error);
            }
        }
    })

    console.log(posts);

    return (
        <div>
            {posts.map((post) => (
                <Card key={post.id}>
                    <Typography>{post.username}</Typography>
                    <CardMedia component="img" height="300" image={`http://localhost:8081${post.image_url}`} alt="post image" />
                    <CardContent><Typography>{post.content}</Typography></CardContent>
                </Card>
            ))}
        </div>
    );
}

export default SurfPosts;
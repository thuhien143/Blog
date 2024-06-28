import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Comments({ postId }) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/comments/${postId}`);
                setComments(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
                // Handle error
            }
        };

        fetchComments();
    }, [postId]);

    return (
        <div>
            {/* Render comments */}
            {comments.map(comment => (
                <div key={comment.id}>
                    <p>{comment.text}</p>
                    {/* Render other comment details */}
                </div>
            ))}
        </div>
    );
}

import "./post.css";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import axios from "axios"; 
import { Context } from "../../context/Context";
import Comments from "../comments/Comments";

export default function Post({ post }) {
  const { user } = useContext(Context);
  const [commentOpen, setCommentOpen] = useState(false);
  const [likes, setLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (post && post._id) {
      const fetchLikes = async () => {
        try {
          const response = await axios.get(`/api/likes?postId=${post._id}`);
          setLikes(response.data);
        } catch (error) {
          console.error("Error fetching likes:", error);
          setError(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchLikes();
    } else {
      setIsLoading(false);
    }
  }, [post]);

  const handleLike = async () => {
    if (user && user._id && post && post._id) {
      try {
        if (likes.includes(user._id)) {
          await axios.delete(`/api/likes`, { data: { userId: user._id, postId: post._id } });
          setLikes((prevLikes) => prevLikes.filter((userId) => userId !== user._id));
        } else {
          await axios.post("/api/likes", { userId: user._id, postId: post._id });
          setLikes((prevLikes) => [...prevLikes, user._id]);
        }
      } catch (error) {
        console.error("Error toggling like:", error);
        setError(error);
      }
    }
  };

  const PF = "http://localhost:5000/images/";

  if (!post) {
    return null; 
  }

  return (
    <div className="post">
      <Link to={`/post/${post._id}`} className="link">
        {post.photo && <img className="postImg" src={PF + post.photo} alt="" />}
      </Link>
      <div className="postInfo">
        <div className="postCats">
          {post.categories.map((c) => (
            <span className="postCat" key={c._id}>{c.name}</span>
          ))}
        </div>
        <Link to={`/post/${post._id}`} className="link">
          <span className="postTitle">{post.title}</span>
        </Link>
        <hr />
        <span className="postDate">{new Date(post.createdAt).toDateString()}</span>
      </div>
      <p className="postDesc">{post.desc}</p>
      <div className="info">
        <div className="item">
          {isLoading ? (
            "Loading..."
          ) : user && likes.includes(user._id) ? (
            <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
          ) : (
            <FavoriteBorderOutlinedIcon onClick={handleLike} />
          )}
          {likes?.length} Likes
        </div>
        <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
          <TextsmsOutlinedIcon />
          See Comments
        </div>
        <div className="item">
          <ShareOutlinedIcon />
          Share
        </div>
        {commentOpen && <Comments postId={post._id} />}
      </div>
      {error && <div className="error">Error: {error.message}</div>}
    </div>
  );
}

const router = require("express").Router();
const Comment = require("../models/Comment");

// Get comments by post ID
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add a comment to a post
router.post("/", async (req, res) => {
  const newComment = new Comment({
    postId: req.body.postId,
    userId: req.body.userId,
    username: req.body.username,
    content: req.body.content,
  });

  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a comment
router.delete("/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json("The comment has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

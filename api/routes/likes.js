const router = require("express").Router();
const Like = require("../models/Like");

// Get likes by post ID
router.get("/", async (req, res) => {
  try {
    const likes = await Like.find({ postId: req.query.postId });
    res.status(200).json(likes.map((like) => like.userId));
  } catch (err) {
    res.status(500).json(err);
  }
});

// Like a post
router.post("/", async (req, res) => {
  const newLike = new Like({
    userId: req.body.userId,
    postId: req.body.postId,
  });

  try {
    const savedLike = await newLike.save();
    res.status(200).json(savedLike);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Unlike a post
router.delete("/", async (req, res) => {
  try {
    await Like.findOneAndDelete({
      userId: req.body.userId,
      postId: req.query.postId,
    });
    res.status(200).json("The like has been removed");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

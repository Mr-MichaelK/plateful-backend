// controllers/commentController.js
export const addComment = async (req, res) => {
  try {
    const { title } = req.params;
    const { rating, comment } = req.body;

    if (!comment && (rating === undefined || rating === null)) {
      return res.status(400).json({ error: "Rating or comment is required" });
    }

    const ratingNumber =
      rating === undefined || rating === null ? null : Number(rating);

    const doc = {
      recipeTitle: decodeURIComponent(title),
      rating: ratingNumber,
      comment: comment || "",
      createdAt: new Date(),
    };

    await req.db.collection("comments").insertOne(doc);
    res.json({ message: "Comment added", comment: doc });
  } catch (err) {
    console.error("Failed to add comment:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

export const getCommentsForRecipe = async (req, res) => {
  try {
    const { title } = req.params;

    const comments = await req.db
      .collection("comments")
      .find({ recipeTitle: decodeURIComponent(title) })
      .sort({ createdAt: -1 }) // newest first
      .toArray();

    res.json(comments);
  } catch (err) {
    console.error("Failed to get comments:", err);
    res.status(500).json({ error: "Failed to get comments" });
  }
};
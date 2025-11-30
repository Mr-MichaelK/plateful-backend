// controllers/favoriteController.js

export const addFavorite = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title } = req.params;
    const decodedTitle = decodeURIComponent(title);

    // Ensure recipe exists
    const recipe = await req.db
      .collection("recipes")
      .findOne({ title: decodedTitle });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Upsert favorite for this specific user + recipe
    await req.db.collection("favorites").updateOne(
      { userEmail, title: decodedTitle },
      {
        $set: {
          userEmail,
          title: decodedTitle,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    res.json({ message: "Added to favorites" });
  } catch (err) {
    console.error("Error adding favorite:", err);
    res.status(500).json({ error: "Failed to add favorite" });
  }
};


export const getFavorites = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const favorites = await req.db
      .collection("favorites")
      .aggregate([
        { $match: { userEmail } },
        {
          $lookup: {
            from: "recipes",
            localField: "title",
            foreignField: "title",
            as: "recipe",
          },
        },
        { $unwind: "$recipe" },
        { $replaceRoot: { newRoot: "$recipe" } },
      ])
      .toArray();

    res.json(favorites);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title } = req.params;
    const decodedTitle = decodeURIComponent(title);

    await req.db
      .collection("favorites")
      .deleteOne({ userEmail, title: decodedTitle });

    res.json({ message: "Favorite removed" });
  } catch (err) {
    console.error("Error removing favorite:", err);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};
import { getDb } from "../db.js";
import { ObjectId } from "mongodb";

export async function updateUserProfile(req, res) {
  try {
    const db = getDb();
    const userId = req.user.id;

    const { name, email, aboutMe } = req.body;

    const profilePicUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not logged in." });
    }

    const currentUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!currentUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const updateFields = {};

    if (name) updateFields.name = name;
    if (aboutMe !== undefined) updateFields.aboutMe = aboutMe;

    if (email && email !== currentUser.email) {
      const existingUser = await db
        .collection("users")
        .findOne({ email: email });

      if (existingUser) {
        return res.status(409).json({ error: "Email already taken." });
      }
      updateFields.email = email;
    } else if (email && email === currentUser.email) {
      // If the email is submitted but unchanged, we still need to include it
      // in case other fields were not submitted (less critical, but cleaner)
      // No action needed here, as it's not part of the updateFields for DB
    }

    if (profilePicUrl) {
      updateFields.profilePicUrl = profilePicUrl;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No fields to update." });
    }

    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateFields },
        { returnDocument: "after" }
      );

    if (!result.value) {
      return res
        .status(404)
        .json({ error: "User not found after update attempt." });
    }

    const updatedUser = {
      id: result.value._id,
      name: result.value.name,
      email: result.value.email,
      aboutMe: result.value.aboutMe,
      profilePicUrl: result.value.profilePicUrl,
    };

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res
      .status(500)
      .json({ error: "Internal server error during profile update." });
  }
}

export async function deleteUserProfile(req, res) {
  try {
    const db = getDb();
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not logged in." });
    }

    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    res
      .status(500)
      .json({ error: "Internal server error during account deletion." });
  }
}

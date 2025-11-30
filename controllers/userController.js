import { getDb } from "../db.js";
import { ObjectId } from "mongodb";

// 🌟 IMPORTANT: Remember to update requireAuth middleware to put the user object on req.user

export async function updateUserProfile(req, res) {
  try {
    const db = getDb();
    // Assuming requireAuth middleware adds user ID to req.user.id
    const userId = req.user.id; // User ID from the authenticated token

    // Data from the form (non-file fields)
    const { name, email, aboutMe } = req.body;

    // File path from multer (if a file was uploaded)
    // The path should be relative to the server's root for public access (e.g., /uploads/filename.jpg)
    const profilePicUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not logged in." });
    }

    // 1. Fetch current user data to compare email
    const currentUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!currentUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const updateFields = {};

    // 2. Update text fields (Name, About Me)
    if (name) updateFields.name = name;
    // Note: Use !== undefined to allow saving an empty string ("") to clear the bio
    if (aboutMe !== undefined) updateFields.aboutMe = aboutMe;

    // 3. Handle Email update (Requires unique check)
    // 🌟 FIX: Only proceed with uniqueness check if the submitted email is different from the current one.
    if (email && email !== currentUser.email) {
      // Check if the new email is already in use by someone else
      const existingUser = await db
        .collection("users")
        .findOne({ email: email });

      if (existingUser) {
        return res.status(409).json({ error: "Email already taken." });
      }
      // If unique, update the field
      updateFields.email = email;
    } else if (email && email === currentUser.email) {
      // If the email is submitted but unchanged, we still need to include it
      // in case other fields were not submitted (less critical, but cleaner)
      // No action needed here, as it's not part of the updateFields for DB
    }

    // 4. Handle Profile Picture update
    if (profilePicUrl) {
      updateFields.profilePicUrl = profilePicUrl;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No fields to update." });
    }

    // Perform the database update
    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateFields },
      { returnDocument: "after" } // Return the updated document
    );

    if (!result.value) {
      // Use result.value as findOneAndUpdate returns an object containing 'value'
      return res
        .status(404)
        .json({ error: "User not found after update attempt." });
    }

    // 5. Respond with the updated user data
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

import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    // JWT stored in a cookie named "auth_token"
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info (needed for favorites, editing, deleting)
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
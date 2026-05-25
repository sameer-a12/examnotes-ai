
import jwt from "jsonwebtoken";

const isAdmin = async (req, res, next) => {
  try {
    const { adminToken } = req.cookies;

    if (!adminToken) {
      return res.status(401).json({ message: "Admin token not found" });
    }

    const verified = jwt.verify(adminToken, process.env.JWT_SECRET);

    if (!verified || verified.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.userId = verified.userId;
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please login again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default isAdmin;
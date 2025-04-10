import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.jwtkey; // Same secret key as in the login route

export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.auth_token; // Get the token from the cookies

    if (!token) {
      return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

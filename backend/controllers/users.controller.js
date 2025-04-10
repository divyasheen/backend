import bcrypt from 'bcrypt';
import User from '../models/users.model.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.jwtkey;

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, biography } = req.body;

    // Backend validation: check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with data from frontend, including optional biography
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      profilepic: `http://localhost:5000/uploads/${req.myFileName}`,
      biography: biography || '', // Handle empty biography (optional)
    });

    await newUser.save();
    res.json({ msg: 'Register success', newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password"); // exclude password field
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message || "Fetching users failed" });
  }
};

export const loginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      // Check if the password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      // Create JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' } // Token expiration time (1 hour)
      );
  
      // Set JWT token in a secure HTTP-only cookie
      res.cookie('auth_token', token, {
        httpOnly: true,      // Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (over HTTPS)
        maxAge: 3600000,     // 1 hour (expires in 1 hour)
      });
  
      res.json({ msg: 'Login successful', user });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

export const logoutUser = (req, res) => {
    res.clearCookie('auth_token'); // Clear the JWT cookie
    res.json({ msg: 'Logout successful' });
  };

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (error) {
    res.status(400).json({ error: 'User not found' });
  }
};

  
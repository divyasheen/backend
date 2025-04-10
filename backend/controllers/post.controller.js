import Post from '../models/post.model.js';

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const author = req.user.userId; // from JWT middleware

    const post = new Post({ content, author });
    await post.save();

    res.json({ msg: 'Post created', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find().populate('author', 'email profilepic').sort({ createdAt: -1 });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
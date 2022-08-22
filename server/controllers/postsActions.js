import mongoose from 'mongoose';
import PostsDataBase from '../models/postModel.js';
import router from '../routes/postsRoutes.js';

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostsDataBase.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8; // number of post per page;
    const startIndex = (Number(page) - 1) * LIMIT;  // conver string to number
    const total = await PostsDataBase.countDocuments({});

    const posts = await PostsDataBase.find().sort({_id: -1}).limit(LIMIT).skip(startIndex);  //_id: -1 give newest post first

    res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  
  try {
    const title = new RegExp(searchQuery, 'i');  // 'i' stands for ingore case: Test test TEST -> gonna be same term

    const posts = await PostsDataBase.find({ $or: [{ title: title }, { tags: { $in: tags.split(',') } }] });  // $or stands for either find the title or find the tags.

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new PostsDataBase({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

  const updatedPost = await PostsDataBase.findByIdAndUpdate(id, { ...post, id }, { new: true });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

  await PostsDataBase.findByIdAndRemove(id);

  res.json({ message: 'Note deleted successfully' });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.json({ message: 'Unauthenticated' });

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

  const post = await PostsDataBase.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatePost = await PostsDataBase.findByIdAndUpdate(id, post, { new: true });

  res.json(updatePost);
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const post = await PostsDataBase.findById(id);

  post.comments.push(value);

  const updatedPost = await PostsDataBase.findByIdAndUpdate(id, post, { new: true });

  res.json(updatedPost);
};
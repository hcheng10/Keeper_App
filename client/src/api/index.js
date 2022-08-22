import axios from 'axios';

const API = axios.create({ baseURL: 'https://the-keeperapi-backend.herokuapp.com' });  // point to backend route; https://the-keeperapi-backend.herokuapp.com or http://localhost:5000

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
  return req;
});

export const fecthPost = (_id) => API.get(`/posts/post/${_id}`);
export const fecthPosts = (page) => API.get(`/posts?page=${page}`);
export const fecthPostsBySearch = (searchQuery) => API.get(`/posts/search/post?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value });

export const signin = (formData) => API.post('/user/signin', formData);
export const signup = (formData) => API.post('/user/signup', formData);
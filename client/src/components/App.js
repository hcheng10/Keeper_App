import React from 'react';
import { Container } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PostDetails from './PostDetails/PostDetails.jsx';
import NavBar from './NavBar/NavBar.js';
import Home from './Home/Home.js';
import Auth from './Auth/Auth.js';

function App() {
  const user = JSON.parse(localStorage.getItem('profile'));


  return (
    <BrowserRouter>
      <Container maxWidth="xl">
        <NavBar />
        <Routes>
          <Route path="/" exact element={ <Navigate to="/posts" /> } />
          <Route path="/posts" exact element={ <Home /> } />
          <Route path="/posts/search/post" exact element={ <Home /> } />
          <Route path="/posts/post/:id" element={ <PostDetails /> } />
          <Route path="/auth" exact element={ !user ? <Auth /> : <Navigate to="/posts" /> } />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
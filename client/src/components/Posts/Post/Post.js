import React, { useState } from "react";
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';


import { deletePost, likePost } from '../../../actions/actions.js';
import useStyles from './styles.js';

function Post({ post, setCurrentId }) { // we have setCurrentId from Posts.js
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'));
  const [likes, setLikes] = useState(post?.likes);

  const userId = user?.result.sub || user?.result?._id;
  const hasLikedPost = post.likes.find((like) => like === userId);

  const handleLike = async () => {
    dispatch(likePost(post._id));

    if (hasLikedPost) {
      setLikes(post.likes.filter((id) => id !== userId));
    } else {
      setLikes([ ...post.likes, userId ]);
    }
  };

  const Likes = () => {
    if (likes.length > 0) {
      return likes.find((like) => like === userId)
        ? (
          <><ThumbUpIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    }

    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
  };
  
  const openPost = () => {
    navigate(`/posts/post/${post._id}`);
  };

  return (
    <Card className={classes.card} raised elevation={6}>
      <CardMedia className={classes.media} image={post.image} title={post.title} component='div'></CardMedia>
      <div className={classes.overlay}>
        <Typography variant="h8">{post.name}</Typography>
        <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
      </div>
      {(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) && (
        <div className={classes.overlay2}>
          <Button
            style={{ color: 'white' }}
            size="small"
            onClick={() => setCurrentId(post._id)}
          >
            <EditIcon fontSize="default" /> &nbsp; edit
          </Button>
        </div>
      )}
      
      <div className={classes.details}>
        <Typography variant="body2" color="textSecondary">{post.tags.map((tag) => `#${tag} `)}</Typography>
      </div>
      <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>

      <ButtonBase className={classes.cardAction} onClick={openPost}>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {post.message.length < 200 ? (post.message) : (post.message.substring(0, 200))}
          </Typography>
          {post.message.length >= 200 && <MoreHorizIcon color="primary" variant="body2"/>}
        </CardContent>
      </ButtonBase>
      
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
          <Likes />
        </Button>
        {(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) && (
          <Button size="small" color="primary" onClick={() => dispatch(deletePost(post._id))}>
            <DeleteIcon fontSize="small" /> &nbsp; Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default Post;
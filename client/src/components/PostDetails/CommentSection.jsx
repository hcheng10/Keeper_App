import React, { useState, useRef } from 'react';
import { Typography, TextField, Button } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useDispatch } from 'react-redux';

import useStyles from './styles.js';
import { commentPost } from '../../actions/actions.js';

const CommentSection = ({ post }) => {
  const classes = useStyles();
  const [comments, setComments] = useState(post.comments);
  const [comment, setComment] = useState('');
  const user = JSON.parse(localStorage.getItem('profile'));
  const dispatch = useDispatch();
  const commentsRef = useRef();

  const handleClick = async () => {
    const finalComment = `${user.result.name}: ${comment}`;

    const newComments = await dispatch(commentPost(finalComment, post._id));

    setComments(newComments);
    setComment('');
  }

  const scrollDown = () => {
    commentsRef.current.scrollIntoView({ 
      behavior: "smooth",
      block: "nearest",
      inline: "start" 
    });
  }

  return (
    <div>
      <div className={classes.commentOuterContainer}>
        <div className={classes.commentInnerContainer}>
          <Typography gutterBottom variant="h6">
            Comments&nbsp;&nbsp;&nbsp;
            {comments.length > 5 && <Button variant='outlined'><ArrowDropDownIcon onClick={scrollDown} /></Button>}
          </Typography>
          {comments?.length ? (comments.map((comment, index) => (
            <Typography key={index} gutterBottom variant="subtitle1">
              <strong>{comment.split(': ')[0]}</strong>:&nbsp;&nbsp;
              {comment.split(':')[1]}
            </Typography>
            ))
          ) : (
            <Typography gutterBottom variant='h7'>
              No comments.
            </Typography>
          )}
          <div ref={commentsRef} />
        </div>
        {user?.result?.name && (
          <div style={{ width: '70%' }}>
            <Typography gutterBottom variant='h6'>Write a Comment</Typography>
            <TextField 
              fullWidth
              multiline={true}
              rows={4}
              variant="outlined"
              label="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button 
              style={{ marginTop: '10px' }} 
              fullWidth 
              disabled={!comment} 
              variant="contained"
              onClick={handleClick}
            >
              Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentSection;
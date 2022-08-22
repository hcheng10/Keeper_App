import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper } from '@mui/material';
import FileBase from 'react-file-base64';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import useStyles from './styles.js';
import { createPost, updatePost } from '../../actions/actions.js';

function SubmitForm(props) { // we have props.currentId, props.setCurrentId from App.js
  const [postData, setPostData] = useState({ title: '', message: '', tags: '', image: '' });
  const post = useSelector((state) => props.currentId ? state.posts.posts.find((p) => p._id === props.currentId) : null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));
  const navigate = useNavigate();

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    props.setCurrentId(null);
    setPostData({ title: '', message: '', tags: '', image: '' });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (props.currentId) { // if we have currentId means we update the note
      dispatch(updatePost(props.currentId, { ...postData, name: user?.result?.name }));
    } else { // if we dont have currentId means we create a note
      dispatch(createPost({ ...postData, name: user?.result?.name }, navigate));
    }
    clear();
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own keeper notes!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{props.currentId ? 'Editing' : 'Creating'} a Keeper Note</Typography>
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          value={postData.title}
          onChange={(event) => setPostData({ ...postData, title: event.target.value })}
          fullWidth
          required
        />
        <TextField
          rows={4}
          multiline
          name="message"
          variant="outlined"
          label="Message"
          value={postData.message}
          onChange={(event) => setPostData({ ...postData, message: event.target.value })}
          fullWidth
          required
        />
        <TextField
          name="tags"
          variant="outlined"
          label="Tags (coma separated)"
          value={postData.tags}
          onChange={(event) => setPostData({ ...postData, tags: event.target.value.split(',') })}
          fullWidth
          required
        />
        <div className={classes.fileInput} >
          <FileBase
            type='file'
            multiple={false}
            onDone={({ base64 }) => setPostData({ ...postData, image: base64 })}
          />
        </div>
        <Button variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button style={{ marginTop: 10 }} variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  );
}

export default SubmitForm;
import React, { useState } from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LockOutlined from '@mui/icons-material/LockOutlined';

import useStyles from './styles.js';
import Input from './Input.js';
import { signin, signup } from '../../actions/loginAndLogout.js';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handelShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSignedUp) {
      dispatch(signup(formData, navigate));
    } else {
      dispatch(signin(formData, navigate));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const switchMode = () => {
    setIsSignedUp((prevIsSignedup) => !prevIsSignedup);
    setShowPassword(false);
  };

  const googleSuccess = async (res) => {
    const result = jwt_decode(res.credential);

    try {
      dispatch({ type: 'AUTH', data: {result: result, token: res.credential} });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const googleError = (error) => {
    console.log(error);
    console.log('Google Sign In was unsuccessful. Try Again Later');
  };

  return (
    <GoogleOAuthProvider clientId="641643388419-q2n5fccgqmpe2973evh7n45d389tmgot.apps.googleusercontent.com">
      <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
          <Avatar className={classes.avatar}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">{isSignedUp ? "Sign up" : "Sign In"}</Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {
                isSignedUp && (
                  <>
                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                    <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                  </>
                )
              }
              <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
              <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handelShowPassword={handelShowPassword} />
              {isSignedUp && <Input name="confirmPassword" label="repeat Password" handleChange={handleChange} type="password" />}

              <Button style={{ marginLeft: 15, marginTop: 10 }} type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                {isSignedUp ? 'Sign Up' : 'Sign In'}
              </Button>

              <Button style={{ marginTop: 10 }} fullWidth>
                <GoogleLogin
                  onSuccess={googleSuccess}
                  onError={googleError}
                />
              </Button>

              <Button style={{ marginTop: 10 }} onClick={switchMode} fullWidth >
                {isSignedUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </Button>

            </Grid>
          </form>
        </Paper>
      </Container>
    </GoogleOAuthProvider>
  )
};

export default Auth;
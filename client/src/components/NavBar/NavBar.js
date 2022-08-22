import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Button, Typography, Toolbar, Avatar } from '@mui/material';
import { useDispatch } from "react-redux";
import decode from "jwt-decode";

import useStyles from './styles';

const NavBar = () => {
  const classes = useStyles();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    dispatch({ type: 'LOGOUT' });

    navigate(0);  // refresh current page

    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) { logout(); }
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  return (
    <AppBar style={{flexDirection: "row"}} className={classes.appBar} position="static" color="inherit">
      <Link to="/" className={classes.brandContainer}>
        <img src={require("../../images/keeper-logo.png")} alt="icon" height="50px"/>
        <img className={classes.image} src={require("../../images/keeper-text.png")} alt="icon" height="60px"/>
      </Link>
      <Toolbar className={classes.toolbar}>
        {user?.result ? (
          <div style={{ marginLeft: 20 }} className={classes.profile}>
            <Avatar className={classes.purple} src={user?.result?.picture} alt={user?.result?.name.charAt(0)} />
            <Typography className={classes.userName} variant="h6">
              {user?.result?.name}
            </Typography>
            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout} >Logout</Button>
          </div>
        ) : (
          <Button component={Link} to="/auth" variant="contained" color="primary" >Sign In</Button>
        )}
      </Toolbar>
    </AppBar>
  )
};

export default NavBar;

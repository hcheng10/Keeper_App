import React from "react";  // rafce to quick import
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { applyMiddleware, compose } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import reducers from './reducers'
import App from "./components/App";
import './index.css';

const store = configureStore({ reducer: reducers }, compose(applyMiddleware(thunk)));

const root = ReactDOM.createRoot(document.getElementById("root"));
const theme = createTheme();

root.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);
import { combineReducers } from "redux";

import todos from './todos';
import authReducer from './auth.js';

export default combineReducers({ posts: todos, auth: authReducer });
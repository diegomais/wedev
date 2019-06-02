import axios from 'axios';
import { setAlert } from './alert';
import { CLEAR_PROFILE } from './profile';
import setAuthToken from '../../utils/setAuthToken';

// Action Types
const REGISTER_SUCCESS = 'wedev/auth/REGISTER_SUCCESS';
const REGISTER_FAIL = 'wedev/auth/REGISTER_FAIL';
const USER_LOADED = 'wedev/auth/USER_LOADED';
const AUTH_ERROR = 'wedev/auth/AUTH_ERROR';
const LOGIN_SUCCESS = 'wedev/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'wedev/auth/LOGIN_FAIL';
const LOGOUT = 'wedev/auth/LOGOUT';

// Reducer
export const TOKEN_KEY = '@wedev-Token';

const initialState = {
  token: localStorage.getItem(TOKEN_KEY),
  isAuthenticated: null,
  loading: true,
  user: null
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem(TOKEN_KEY, payload.token);
      return { ...state, ...payload, isAuthenticated: true, loading: false };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem(TOKEN_KEY);
      return { ...state, token: null, isAuthenticated: false, loading: false };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload.user
      };
    default:
      return state;
  }
}

// Action Creators

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage[TOKEN_KEY]) setAuthToken(localStorage[TOKEN_KEY]);

  try {
    const res = await axios.get('/api/auth');

    dispatch({ type: USER_LOADED, payload: { user: res.data } });
  } catch (error) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Register User
export const registerUser = ({ name, email, password }) => async dispatch => {
  const config = { headers: { 'Content-Type': 'application/json' } };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
    dispatch(loadUser());
    dispatch(
      setAlert({
        alertType: 'success',
        message: 'You have successfully registered!'
      })
    );
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors)
      errors.forEach(error =>
        dispatch(
          setAlert({
            alertType: 'danger',
            message: error.msg,
            timeout: 20000
          })
        )
      );

    dispatch({ type: REGISTER_FAIL });
  }
};

// Login User
export const loginUser = ({ email, password }) => async dispatch => {
  const config = { headers: { 'Content-Type': 'application/json' } };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    dispatch(loadUser());
    dispatch(
      setAlert({
        alertType: 'success',
        message: 'You have successfully logged in!'
      })
    );
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors)
      errors.forEach(error =>
        dispatch(
          setAlert({
            alertType: 'danger',
            message: error.msg,
            timeout: 20000
          })
        )
      );

    dispatch({ type: LOGIN_FAIL });
  }
};

// Logout / Clear Profile
export const logoutUser = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

import axios from 'axios';
import { setAlert } from './alert';
import setAuthToken from '../../utils/setAuthToken';

// Action Types
const REGISTER_SUCCESS = 'wedev/auth/REGISTER_SUCCESS';
const REGISTER_FAIL = 'wedev/auth/REGISTER_FAIL';
const USER_LOADED = 'wedev/auth/USER_LOADED';
const AUTH_ERROR = 'wedev/auth/AUTH_ERROR';

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
      localStorage.setItem(TOKEN_KEY, payload.token);
      return { ...state, ...payload, isAuthenticated: true, loading: false };
    case REGISTER_FAIL:
    case AUTH_ERROR:
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

// Register User
export const registerUser = ({ name, email, password }) => async dispatch => {
  const config = { headers: { 'Content-Type': 'application/json' } };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
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

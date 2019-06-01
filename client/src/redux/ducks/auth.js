import axios from 'axios';
import { setAlert } from './alert';

// Action Types
const REGISTER_SUCCESS = 'wedev/auth/REGISTER_SUCCESS';
const REGISTER_FAIL = 'wedev/auth/REGISTER_FAIL';

// Reducer
const tokenKey = 'wedev/auth/token';

const initialState = {
  token: localStorage.getItem(tokenKey),
  isAuthenticated: null,
  loading: true,
  user: null
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
      localStorage.setItem(tokenKey, payload.token);
      return { ...state, ...payload, isAuthenticated: true, loading: false };
    case REGISTER_FAIL:
      localStorage.removeItem(tokenKey);
      return { ...state, token: null, isAuthenticated: false, loading: false };
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

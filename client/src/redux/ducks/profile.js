import axios from 'axios';
import { setAlert } from './alert';

// Action Types
const GET_PROFILE = 'wedev/profile/GET_PROFILE';
const PROFILE_ERROR = 'wedev/profile/PROFILE_ERROR';
export const CLEAR_PROFILE = 'wedev/profile/CLEAR_PROFILE';

// Reducer
const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
};
export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return { ...state, profile: payload.profile, loading: false };
    case PROFILE_ERROR:
      return { ...state, error: payload.error, loading: false };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        profiles: [],
        repos: [],
        loading: false
      };
    default:
      return state;
  }
}

// Action Creators

// Get current users profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({ type: GET_PROFILE, payload: { profile: res.data } });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        error: {
          message: error.response.statusText,
          status: error.response.status
        }
      }
    });
  }
};

// Create or update profile
export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.post('/api/profile', formData, config);

    dispatch({ type: GET_PROFILE, payload: { profile: res.data } });

    if (!edit) history.push('/dashboard');
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

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        error: {
          message: error.response.statusText,
          status: error.response.status
        }
      }
    });
  }
};

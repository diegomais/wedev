import axios from 'axios';
import { setAlert } from './alert';
import { ACCOUNT_DELETED } from './auth';

// Action Types
const GET_PROFILE = 'wedev/profile/GET_PROFILE';
const UPDATE_PROFILE = 'wedev/profile/UPDATE_PROFILE';
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
    case UPDATE_PROFILE:
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

    dispatch(
      setAlert({
        alertType: 'success',
        message: edit ? 'Profile Updated' : 'Profile Created'
      })
    );

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

// Add Experience
export const addExperience = (formData, history) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.put('/api/profile/experience', formData, config);

    dispatch({ type: UPDATE_PROFILE, payload: { profile: res.data } });

    dispatch(setAlert({ alertType: 'success', message: 'Experience added' }));

    history.push('/dashboard');
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

// Add Education
export const addEducation = (formData, history) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.put('/api/profile/education', formData, config);

    dispatch({ type: UPDATE_PROFILE, payload: { profile: res.data } });

    dispatch(setAlert({ alertType: 'success', message: 'Education added' }));

    history.push('/dashboard');
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

// Delete experience
export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispatch({ type: UPDATE_PROFILE, payload: { profile: res.data } });

    dispatch(setAlert({ alertType: 'success', message: 'Experience removed' }));
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

// Delete education
export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);

    dispatch({ type: UPDATE_PROFILE, payload: { profile: res.data } });

    dispatch(setAlert({ alertType: 'success', message: 'Education removed' }));
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

// Delete account and profile
export const deleteAccount = () => async dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await axios.delete('/api/profile');

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(
        setAlert({ message: 'Your account has been permanently deleted' })
      );
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
  }
};

import axios from 'axios';
import { setAlert } from './alert';

// Action Types
const GET_POSTS = 'wedev/post/GET_POSTS';
const DELETE_POST = 'wedev/post/DELETE_POST';
const UPDATE_LIKES = 'wedev/post/UPDATE_LIKES';
const POST_ERROR = 'wedev/post/POST_ERROR';

// Reducer
const initialState = { posts: [], post: null, loading: true, error: {} };

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return { ...state, posts: payload, loading: false };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload),
        loading: false
      };
    case POST_ERROR:
      return { ...state, error: payload, loading: false };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.id ? { ...post, likes: payload.likes } : post
        ),
        loading: false
      };
    default:
      return state;
  }
}

// Action Creators

// Get posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/posts');

    dispatch({ type: GET_POSTS, payload: res.data });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        error: {
          message: error.response.statusText,
          status: error.response.status
        }
      }
    });
  }
};

// Delete post
export const deletePost = postId => async dispatch => {
  try {
    await axios.delete(`/api/posts/${postId}`);

    dispatch({ type: DELETE_POST, payload: postId });

    dispatch(setAlert({ alertType: 'success', message: 'Post Removed' }));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        error: {
          message: error.response.statusText,
          status: error.response.status
        }
      }
    });
  }
};

// Add like
export const addLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${postId}`);

    dispatch({ type: UPDATE_LIKES, payload: { id: postId, likes: res.data } });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        error: {
          message: error.response.statusText,
          status: error.response.status
        }
      }
    });
  }
};

// Remove like
export const removeLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${postId}`);

    dispatch({ type: UPDATE_LIKES, payload: { id: postId, likes: res.data } });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        error: {
          message: error.response.statusText,
          status: error.response.status
        }
      }
    });
  }
};

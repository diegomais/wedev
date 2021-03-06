import axios from 'axios';
import { setAlert } from './alert';

// Action Types
const GET_POSTS = 'wedev/post/GET_POSTS';
const GET_POST = 'wedev/post/GET_POST';
const ADD_POST = 'wedev/post/ADD_POST';
const DELETE_POST = 'wedev/post/DELETE_POST';
const UPDATE_LIKES = 'wedev/post/UPDATE_LIKES';
const ADD_COMMENT = 'wedev/post/ADD_COMMENT';
const DELETE_COMMENT = 'wedev/post/DELETE_COMMENT';
const POST_ERROR = 'wedev/post/POST_ERROR';

// Reducer
const initialState = { posts: [], post: null, loading: true, error: {} };

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return { ...state, posts: payload, loading: false };
    case GET_POST:
      return { ...state, post: payload, loading: false };
    case ADD_POST:
      // Put payload before because the new post is loaded before old posts.
      return { ...state, posts: [payload, ...state.posts], loading: false };
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
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false
      };
    case DELETE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            comment => comment._id !== payload
          )
        },
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

// Get post
export const getPost = postId => async dispatch => {
  try {
    const res = await axios.get(`/api/posts/${postId}`);

    dispatch({ type: GET_POST, payload: res.data });
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

// Add post
export const addPost = formData => async dispatch => {
  const config = { headers: { 'Content-Type': 'application/json' } };

  try {
    const res = await axios.post('/api/posts', formData, config);

    dispatch({ type: ADD_POST, payload: res.data });

    dispatch(setAlert({ alertType: 'success', message: 'Post Created' }));
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

// Add comment
export const addComment = (postId, formData) => async dispatch => {
  const config = { headers: { 'Content-Type': 'application/json' } };

  try {
    const res = await axios.post(
      `/api/posts/${postId}/comment`,
      formData,
      config
    );

    dispatch({ type: ADD_COMMENT, payload: res.data });

    dispatch(setAlert({ alertType: 'success', message: 'Comment Added' }));
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

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    await axios.delete(`/api/posts/${postId}/comment/${commentId}`);

    dispatch({ type: DELETE_COMMENT, payload: commentId });

    dispatch(setAlert({ alertType: 'success', message: 'Comment Removed' }));
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

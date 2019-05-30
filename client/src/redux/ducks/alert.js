import uuid from 'uuid';

// Action Types
const SET_ALERT = 'wedev/alert/SET_ALERT';
const REMOVE_ALERT = 'wedev/alert/REMOVE_ALERT';

// Reducer
export default function reducer(state = [], action = {}) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload.id);
    default:
      return state;
  }
}

// Action Creators
export const setAlert = ({
  alertType,
  message,
  timeout = 5000
}) => dispatch => {
  const id = uuid.v4();
  dispatch({
    type: SET_ALERT,
    payload: { id, alertType, message }
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: { id } }), timeout);
};

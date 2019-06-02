import { combineReducers } from 'redux';

import alert from './alert';
import auth from './auth';
import profile from './profile';

const rootReducer = combineReducers({ alert, auth, profile });

export default rootReducer;

import { combineReducers } from 'redux';


export default ( routeReducer ) => {
  return combineReducers({
    location: routeReducer,
  });
};

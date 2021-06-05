import { combineReducers } from 'redux';
import elements from './elements';
import modal from './modal';

export default combineReducers({
  elements,
  modal,
});

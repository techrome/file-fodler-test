import { createStore, compose, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { isdev } from 'src/config';
import rootStore from './stores';

const composeSetup = isdev ? composeWithDevTools : compose;

const initialState = {};
const middleware = [];
const store = createStore(
  rootStore,
  initialState,
  composeSetup(applyMiddleware(...middleware)),
);

export default store;

import { compose, createStore, applyMiddleware } from 'redux';
import reducers from '../reducers/index';

const middleware = [];

// if (process.env.NODE_ENV === 'development') {
//   middleware.push(logger);
// }

const store = createStore(reducers, compose(applyMiddleware(...middleware)));

export default store;

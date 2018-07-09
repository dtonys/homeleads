import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import createRootReducer from 'redux/rootReducer';
import { connectRoutes } from 'redux-first-router';
import routesMap from 'redux/routesMap';


export default ( initialState = {}, history ) => {
  const {
    reducer: routeReducer,
    middleware: routeMiddleware,
    enhancer: routeEnhancer,
  } = connectRoutes(history, routesMap);

  const middleware = [];
  if ( process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    const logger = createLogger();
    middleware.push( logger );
  }
  middleware.push( routeMiddleware );
  const appliedMiddleware = compose( routeEnhancer, applyMiddleware(...middleware) );
  const rootReducer = createRootReducer( routeReducer );
  const store = createStore(rootReducer, initialState, appliedMiddleware);

  if ( module.hot ) {
    module.hot.accept('./rootReducer', () => {
      const _createRootReducer = require('./rootReducer').default;
      const _rootReducer = _createRootReducer( routeReducer );
      store.replaceReducer(_rootReducer);
    });
  }

  return store;
};

import {createStore, applyMiddleware, compose} from 'redux'
import rootReducer from './reducers'
import thunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage';
import {persistReducer } from 'redux-persist';

const myReducer = persistReducer({
 key: 'root',
 storage
}, rootReducer);

/** @namespace window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ */
const rootStore = createStore(myReducer,compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__():f=>f
));


export default rootStore

import { compose, createStore, applyMiddleware } from 'redux';import {reducer as formReducer} from 'redux-form';
import { AsyncStorage } from 'react-native';
import { persistStore, autoRehydrate } from 'redux-persist';
import UDCReducer from './reducers/udc.reducer';
import rootReducer from  './reducers/index.reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {composeWithDevTools} from "redux-devtools-extension";

//Compose with devtools enables debugging with React Native Debugger

const store =createStore(
    rootReducer,
    undefined,
    composeWithDevTools(
    // compose(
        applyMiddleware(
            thunk,
        ),
        autoRehydrate()
    )
// )
);
persistStore(
    store,
    { storage: AsyncStorage }
    );


export default store;
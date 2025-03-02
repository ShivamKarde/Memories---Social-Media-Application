import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { legacy_createStore as createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import dotenv from 'dotenv';

import reducers from './reducers';
import App from './App';
import './index.css';

const store = createStore(reducers, compose(applyMiddleware(thunk)))
dotenv.config();
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
ReactDOM.render(
    
    <GoogleOAuthProvider clientId={CLIENT_ID}>
        <Provider store={store}>
            <App />
        </Provider>,
    </GoogleOAuthProvider>,
    document.getElementById('root')
);

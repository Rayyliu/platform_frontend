import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Router } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import history from './utils/history'
import { Provider } from 'react-redux'
import store from './store'
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
const persistor = persistStore(store);

moment.locale('zh-cn');

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Router history={history}>
                <LocaleProvider locale={zh_CN}>
                    <App />
                </LocaleProvider>
            </Router>
        </PersistGate>
    </Provider >,
    document.getElementById('root'));

serviceWorker.unregister();

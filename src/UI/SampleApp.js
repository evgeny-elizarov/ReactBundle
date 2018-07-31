import React from 'react';
import { render } from 'react-dom';
import App from './app';
import registerServiceWorker from './Services/registerServiceWorker';
import { appState } from './Stores/index';
import './SampleApp.scss';

/**
 * Sample react application
 */
render(
    <App stateStore={appState}>
        <h1>Hello world!</h1>
    </App>,
    document.getElementById('root')
);
registerServiceWorker();
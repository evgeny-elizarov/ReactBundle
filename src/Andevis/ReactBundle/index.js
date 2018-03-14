import React, { Component } from 'react';
import ReactDOM, {render} from "react-dom";
import ReactDOMServer from "react-dom/server";
import App from './UI/App';

import { Switch, Route } from 'react-router-dom';
import { setBundle } from "./UI/Helpers";
import ExamplesMenu from "./UI/Views/ExamplesMenu";

setBundle('React', () => (
    <Switch>
        { process.env.NODE_ENV !== 'production' &&
        <Route path='/react/example' component={ExamplesMenu}/>
        }
    </Switch>
));


export default React;
export {
    React,
    Component,
    ReactDOM,
    ReactDOMServer,
    render,
    App
}
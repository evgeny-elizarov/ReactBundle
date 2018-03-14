import React, { Component } from 'react';
import ReactDOM, {render} from "react-dom";
import ReactDOMServer from "react-dom/server";
import App from './UI/App';

import { Switch, Route } from 'react-router-dom';
import { setBundle } from "./UI/Helpers";
import Examples from "./UI/Views/Examples";

setBundle('React', () => (
    <Switch>
        { process.env.NODE_ENV !== 'production' &&
        <Route path='/react/example' component={Examples}/>
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
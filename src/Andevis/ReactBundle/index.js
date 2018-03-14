import React from 'react';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import {render} from "react-dom";
import {Switch, Route} from 'react-router-dom';
import PropTypes from 'prop-types'
import $ from 'jquery';
import App from './UI/App';

export default React;
export {
    React,
    render,
    PropTypes,
    Switch, Route,
    observable,
    observer,
    action,
    $,
    App
}
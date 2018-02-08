import React from 'react';
import JqxMenu from './../../vendors/jqwidgets-react/react_jqxmenu.js';
import PropTypes from 'prop-types';
import { filterObjectByKeys } from "./../../Helpers";

export default class Menu extends React.Component
{
    static propTypes = {
        theme: PropTypes.string,
        animationShowDuration: PropTypes.number,
        animationHideDuration: PropTypes.number,
        animationHideDelay: PropTypes.number,
        animationShowDelay: PropTypes.number
    };

    static defaultProps = {
        theme: 'bootstrap',
        animationShowDuration: 150,
        animationHideDuration: 150,
        animationHideDelay: 200,
        animationShowDelay: 100
    };

    render(){
        const JqxProps = filterObjectByKeys(this.props, [
            'theme',
            'animationShowDuration',
            'animationHideDuration',
            'animationHideDelay',
            'animationShowDelay'
        ]);
        return (
            <JqxMenu {...JqxProps}>{this.props.children}</JqxMenu>
        )
    }
}
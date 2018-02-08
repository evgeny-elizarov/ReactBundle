import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JqxButton from './../../vendors/jqwidgets-react/react_jqxbuttons';
import { filterObjectByKeys } from "../../Helpers/base";

export default class Button extends React.Component
{
    static propTypes = {
        onClick: PropTypes.func,
        theme: PropTypes.string,
        style: PropTypes.object,
        value: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
    };

    static defaultProps = {
        theme: 'bootstrap',
        value: 'Button',
        height: 30
    };

    componentDidMount(){
        if(this.props.onClick){
            this.refs.Button.on('click', this.props.onClick);
        }
    }

    render(){
        const JqxProps = filterObjectByKeys(this.props, [
            'theme',
            'style',
            'value',
            'width',
            'height'
        ]);
        return (
            <JqxButton ref={"Button"} {...JqxProps}>{this.props.children}</JqxButton>
        )
    }
}
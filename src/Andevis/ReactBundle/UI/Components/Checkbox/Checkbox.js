import React from 'react';
import { Component } from './../../ComponentBase';
import { FormField } from 'react-form';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import classNames from 'classnames';



@FormField
export default class Checkbox extends Component
{
    // static propTypes = Object.assign({}, Component.propTypes, {
    //     field: PropTypes.string.isRequired
    // });

    getBundleName() {
        return 'React';
    }

    @autobind
    handleOnChangeEvent(e) {
        if(this.props.fieldApi) {
            this.props.fieldApi.setValue(!this.checked);
        } else {
            this.setAttributeValue('checked', !this.checked);
        }
    }

    // Attribute: checked
    get checked() {
        if(this.props.fieldApi){
            let v = this.props.fieldApi.getValue();
            return typeof v === 'boolean' ? v : false;
        } else {
            return this.getAttributeValue('checked', false);
        }
    }

    set checked(value) {
        if(this.props.fieldApi){
            this.props.fieldApi.setValue(value);
        } else {
            this.setAttributeValue('checked', value);
        }
    }

    componentDidMount(){
        if(this.props.checked)
        {
            this.checked = true;
        }
    }

    render(){
        return (
            <input
                type="checkbox"
                checked={this.checked}
                onChange={this.handleOnChangeEvent}
            />
        )
    }
}
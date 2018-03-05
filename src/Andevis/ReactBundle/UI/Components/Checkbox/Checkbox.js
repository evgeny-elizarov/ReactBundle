import React from 'react';
import { FormField } from 'react-form';
import { autobind } from 'core-decorators';
import {FormInputBase, InputWrapper } from "@AndevisReactBundle/UI/Components/Form/FormInputBase";
import classNames from 'classnames';
import './Checkbox.scss';



@FormField
export default class Checkbox extends FormInputBase
{
    // static propTypes = Object.assign({}, Component.propTypes, {
    //     field: PropTypes.string.isRequired
    // });

    getBundleName() {
        return 'React';
    }

    @autobind
    handleOnChangeEvent(e) {
        this.checked = !this.checked;
        this.setAttributeValue('checked', !this.checked, () => {
            this.change(this.checked);
        });
    }

    // Attribute: checked
    get checked() {
        return this.value;
    }

    set checked(value) {
        this.value = value;
    }

    componentDidMount(){
        if(this.props.checked)
        {
            this.checked = this.props.checked;
        }
    }

    render(){
        let props = Object.assign({}, this.props);
        props.className = classNames(props.className, "form-input-checkbox");
        return (
            <InputWrapper hasFocus={this.hasFocus} {...props}>
                <input
                    type="checkbox"
                    checked={this.checked}
                    onChange={this.handleOnChangeEvent}
                />
            </InputWrapper>
        )
    }
}
import React from 'react';
import PropTypes from 'prop-types';
// import { FormField } from 'react-form';
import { autobind } from 'core-decorators';
import { FieldBase, formFieldWrapper } from "@AndevisReactBundle/UI/Components/Form/Field";
import Component from '@AndevisReactBundle/UI/ComponentBase/Component';
import InputWrapper from "@AndevisReactBundle/UI/Components/Form/InputWrapper";
import classNames from 'classnames';
import './Checkbox.scss';

class CheckboxBase extends FieldBase
{
    static propTypes = Object.assign({}, FieldBase.propTypes, {
        checked: PropTypes.bool,
    });

    static defaultProps = Object.assign({}, FieldBase.defaultProps, {
        checked: false
    });

    getBundleName() {
        return 'React';
    }

    getShortClassName(){
        return 'Checkbox';
    }

    /**
     * Check or set checked
     * @returns {boolean}
     */
    isChecked(){
        if(arguments.length > 0){
            const newValue = (arguments[0]); // Convert to boolean
            this.setValue(newValue);
            // this.change(newValue);
        }
        return this.props.fieldApi ? (this.props.value || this.props.checked) : this.getAttributeValue('value', this.props.checked)
    }

    @autobind
    handleChangeEvent(e) {
        if(!this.readOnly){
            const newValue = !this.isChecked();
            this.change(newValue);
            this.isChecked(newValue);
        }
    }

    getFieldWrapperProps(){
        let props = super.getFieldWrapperProps();
        props.className += ' checkbox-form-component';
        return props;
    }

    getFieldControlProps(){

        return Object.assign({
            // className: 'form-control',
            type: 'checkbox',
            required: this.required,
            readOnly: this.props.readOnly,
            checked: this.isChecked(),
            disabled: (
                this.backendEventProcessing ||
                !this.enabled ||
                (
                    this.context.hasOwnProperty('form') &&
                    typeof this.context.form === Component &&
                    this.context.form.backendEventProcessing
                )
            ),
            //onInput: this.handleInputEvent,
            onChange: this.handleChangeEvent,
            onBlur: this.handleBlurEvent,
            onFocus: this.handleFocusEvent,
            onClick: this.click,
            onDoubleClick: this.doubleClick,
            // onKeyPress: this.handleKeyPress
        }, this.props.inputProps);
    }

    render(){
        return (
            <InputWrapper {...this.getFieldWrapperProps()}>
                <input {...this.getFieldControlProps()} />
            </InputWrapper>
        )
    }
}

@formFieldWrapper
class Checkbox extends CheckboxBase {}

export default Checkbox;
export {
    CheckboxBase,
    Checkbox
}

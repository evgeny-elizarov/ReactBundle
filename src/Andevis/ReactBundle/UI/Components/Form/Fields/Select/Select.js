import React from 'react';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import {FieldBase, formFieldWrapper } from "@AndevisReactBundle/UI/Components/Form/Field";
import InputWrapper from "@AndevisReactBundle/UI/Components/Form/InputWrapper";
import { Component } from "@AndevisReactBundle/UI/ComponentBase";
import PropTypes from "prop-types";

class SelectBase extends FieldBase {
    static propTypes = Object.assign({}, FieldBase.propTypes, {
        options: PropTypes.array,
        selectProps: PropTypes.object
    });

    static defaultProps = Object.assign({}, FieldBase.defaultProps, {
        options: [],
    });

    getBundleName() {
        return 'React';
    }

    getShortClassName() {
        return 'Select';
    }

    /**
     * Attribute: options
     * @returns {*}
     */
    get options() {
        const defaultOptions = this.props.options ? this.props.options.slice(0) : [];
        return this.getAttributeValue('options', defaultOptions);
    }

    set options(value) {
        this.setAttributeValue('options', value);
    }

    /**
     * Add options
     * @param text
     * @param value
     * @param data
     */
    addOption(text, value, data) {
        if (!Array.isArray(this.options)) {
            this.options = [];
        }
        this.options.push({
            text: text,
            value: value,
            data: data
        });
    }

    removeOptionsByValue(value) {
        if (Array.isArray(this.options)) {
            for (let i in this.options) {
                if (this.options.hasOwnProperty(i)) {
                    if (this.options[i]['value'] === value) {
                        return this.options[i];
                    }
                }
            }
        }
    }

    /**
     * Selected option
     * @returns {*}
     */
    getSelectedOption() {
        for (let i in this.options) {
            if (this.options.hasOwnProperty(i)) {
                if (this.options[i].value === this.value) {
                    return this.options[i];
                }
            }
        }
    }

    @autobind
    handleInputEvent(event) {
        super.handleInputEvent(event);
        this.change(event.target.value);
    }

    getFieldControlProps() {
        return Object.assign({
            className: 'form-control',
            required: this.props.required,
            readOnly: this.props.readOnly,
            value: this.value || '',
            disabled: (
                this.backendEventProcessing ||
                this.props.readOnly ||
                !this.enabled ||
                (
                    this.context.hasOwnProperty('form') &&
                    typeof this.context.form === Component &&
                    this.context.form.backendEventProcessing
                )
            ),
            onInput: this.handleInputEvent,
            onBlur: this.handleBlurEvent,
            onFocus: this.handleFocusEvent,
            onClick: this.click,
            onDoubleClick: this.doubleClick,
            onKeyPress: this.handleKeyPress
        }, this.props.selectProps);
    }

    render() {
        return (
            <InputWrapper {...this.getFieldWrapperProps()}>
                <select {...this.getFieldControlProps()}>
                    {this.options.map((option, i) =>
                         <option key={i} value={option.value}>{option.text}</option>
                     )}
                </select>
            </InputWrapper>
        );
    }

}

@formFieldWrapper
class Select extends SelectBase {}

export default Select;
export {
    SelectBase,
    Select
}

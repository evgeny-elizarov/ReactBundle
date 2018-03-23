import React from 'react';
import { FormField } from 'react-form';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import {FormInputBase, InputWrapper } from "@AndevisReactBundle/UI/Components/Form/FormInputBase";
import { Component } from "@AndevisReactBundle/UI/ComponentBase";
import PropTypes from "prop-types";

// TODO: remove attribute inputClassName from PropTypes
class SelectBase extends FormInputBase {
    static propTypes = Object.assign({}, FormInputBase.propTypes, {
        options: PropTypes.array,
        selectProps: PropTypes.object
    });

    static defaultProps = Object.assign({}, FormInputBase.defaultProps, {
        options: [],
    });

    getBundleName() {
        return 'React';
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
    handleOnChangeEvent(event) {
        this.change(event.target.value);
    }

    render() {
        let props = Object.assign({}, this.props);
        props.className = classNames(props.className, "form-input-select");

        // Convert value to string
        const value = typeof this.value === 'undefined' || this.value === null ?
            '' : String(this.value);

        const selectProps = Object.assign({
            className: 'form-control',
            required: this.props.required,
            disabled: this.props.readOnly || this.backendEventProcessing || !this.enabled,
            value: value,
        }, this.props.selectProps);

        return (
            <InputWrapper hasFocus={this.hasFocus} {...props}>
                <select
                    {...selectProps}
                    autoComplete={this.props.autoComplete}
                    onChange={this.handleOnChangeEvent}
                    onBlur={this.handleOnBlurEvent}
                    value={this.props.defaultValue}
                    onClick={this.handleOnClickEvent}>
                     {this.options.map((option, i) =>
                         <option key={i} value={option.value}>{option.text}</option>
                     )}
                </select>
            </InputWrapper>
        );
    }
}

@FormField
class Select extends SelectBase {}

export default Select;
export {
    SelectBase,
    Select
}


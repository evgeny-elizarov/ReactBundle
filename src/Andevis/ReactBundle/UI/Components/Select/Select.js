import React from 'react';
import { FormField } from 'react-form';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import {FormInputBase, InputWrapper } from "@AndevisReactBundle/UI/Components/Form/FormInputBase";
import { Component } from "@AndevisReactBundle/UI/ComponentBase";
import PropTypes from "prop-types";


class SelectBase extends FormInputBase {
    static propTypes = Object.assign({}, FormInputBase.propTypes, {
        options: PropTypes.array,
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
        this.value = event.target.value;
        this.change(event.target.value);
    }

    render() {
        let props = Object.assign({}, this.props);
        props.className = classNames(props.className, "form-input-select");
        // Convert value to string
        const value = typeof this.value === 'undefined' || this.value === null ?
            '' : String(this.value);
        return (
            <InputWrapper hasFocus={this.hasFocus} {...props}>
                <select
                    className={classNames('form-control', this.props.inputClassName )}
                    placeholder={this.props.placeholder}
                    autoComplete={this.props.autoComplete}
                    required={this.props.required}
                    // readOnly={this.props.readOnly}
                    onChange={this.handleOnChangeEvent}
                    onBlur={this.handleOnBlurEvent}
                    onClick={this.handleOnClickEvent}
                    disabled={this.props.readOnly || !this.enabled}
                    value={value}>
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


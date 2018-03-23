import React from 'react';
import classNames from 'classnames';
import {FormField} from 'react-form';
import {FormInputBase, InputWrapper } from "@AndevisReactBundle/UI/Components/Form/FormInputBase";
import './Text.scss';
import PropTypes from "prop-types";


// TODO: remove inputClassName, type from PropTypes
class TextBase extends FormInputBase {

    static propTypes = Object.assign({}, FormInputBase.propTypes, {
        inputProps: PropTypes.object
    });

    static defaultProps = Object.assign({}, FormInputBase.defaultProps, {
        type: 'text'
    });

    getBundleName() {
        return 'React';
    }

    render() {
        let props = Object.assign({}, this.props);
        props.className = classNames(props.className, "form-input-" + this.props.type);

        // Convert value to string
        const value = typeof this.value === 'undefined' || this.value === null ?
            '' : String(this.value);

        const inputProps = Object.assign({
            type: this.props.type,
            className: 'form-control',
            placeholder: this.props.placeholder,
            autoComplete: this.props.autoComplete,
            style: this.props.style,
            required: this.props.required,
            readOnly: this.props.readOnly,
            value: value,
            disabled: !this.enabled
        }, this.props.inputProps);

        return (
            <InputWrapper hasFocus={this.hasFocus} {...props}>
                <input
                    onInput={this.handleOnInputEvent}
                    onBlur={this.handleOnBlurEvent}
                    onFocus={this.handleOnFocusEvent}
                    onClick={this.handleOnClickEvent}
                    {...inputProps}
                />
            </InputWrapper>
        );
    }
}

@FormField
class Text extends TextBase {}


export default Text;
export {
    TextBase,
    Text
}
import React from 'react';
import classNames from 'classnames';
import {Component} from './../../ComponentBase';
import {FormField} from 'react-form';
import {FormInputBase, InputWrapper } from "@AndevisReactBundle/UI/Components/Form/FormInputBase";
import './Text.scss';


class TextBase extends FormInputBase {

    static defaultProps = Object.assign({}, Component.defaultProps, {
        type: 'text'
    });

    getBundleName() {
        return 'React';
    }

    render() {
        let props = Object.assign({}, this.props);
        props.className = classNames(props.className, "form-input-" + this.props.type);
        return (
            <InputWrapper hasFocus={this.hasFocus} {...props}>
                <input
                    type={this.props.type}
                    className={classNames('form-control', this.props.inputClassName )}
                    placeholder={this.props.placeholder}
                    autoComplete={this.props.autoComplete}
                    required={this.props.required}
                    readOnly={this.props.readOnly}
                    onInput={this.handleOnInputEvent}
                    onBlur={this.handleOnBlurEvent}
                    onFocus={this.handleOnFocusEvent}
                    onClick={this.handleOnClickEvent}
                    value={this.value}
                    disabled={!this.enabled}
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
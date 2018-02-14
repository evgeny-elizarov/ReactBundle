import React from 'react';
import classNames from 'classnames';
import {FormField} from 'react-form';
import {FormInputBase, InputWrapper} from "@AndevisReactBundle/UI/Components/Form/FormInputBase";

class TextAreaBase extends FormInputBase {

    getBundleName() {
        return 'React';
    }

    render() {
        let props = Object.assign({}, this.props);
        props.className = classNames(props.className, "form-input-textarea");

        // Convert value to string
        const value = typeof this.value === 'undefined' || this.value === null ?
            '' : String(this.value);

        return (
            <InputWrapper hasFocus={this.hasFocus} {...props}>
                <textarea
                    className={classNames('form-control', this.props.inputClassName )}
                    placeholder={this.props.placeholder}
                    autoComplete={this.props.autoComplete}
                    required={this.props.required}
                    readOnly={this.props.readOnly}
                    onInput={this.handleOnInputEvent}
                    onBlur={this.handleOnBlurEvent}
                    onClick={this.handleOnClickEvent}
                    value={value}
                    disabled={!this.enabled}
                />
            </InputWrapper>
        );
    }
}


@FormField
class TextArea extends TextAreaBase {}

export default TextArea;
export {
    TextAreaBase,
    TextArea
}

import React from 'react';
import classNames from 'classnames';
import { FieldBase, formFieldWrapper } from "@AndevisReactBundle/UI/Components/Form/Field";
import InputWrapper from "@AndevisReactBundle/UI/Components/Form/InputWrapper";
import { Component } from "@AndevisReactBundle/UI/ComponentBase";

class TextAreaBase extends FieldBase {

    static bundleName = 'React';

    getShortClassName(){
        return 'TextArea';
    }

    getFieldWrapperProps(){
        let props = super.getFieldWrapperProps();
        props.className += ' textarea-form-component';
        return props;
    }

    render() {
        return (
            <InputWrapper {...this.getFieldWrapperProps()}>
                <textarea {...this.getFieldControlProps()} />
            </InputWrapper>
        );
    }
}

@formFieldWrapper
class TextArea extends TextAreaBase {}

export default TextArea;
export {
    TextAreaBase,
    TextArea
}

import React from 'react';
import { FieldBase, formFieldWrapper } from "@AndevisReactBundle/UI/Components/Form/Field";
import './Text.scss';

class TextBase extends FieldBase {

    static defaultProps = Object.assign({}, FieldBase.defaultProps, {
        type: 'text'
    });

    getShortClassName(){
        return 'Text';
    }

    getFieldControlProps(){
        return Object.assign(super.getFieldControlProps(), {
            type: this.props.type
        });
    }
}

@formFieldWrapper
export default class Text extends TextBase {};

export {
    TextBase,
    Text
}
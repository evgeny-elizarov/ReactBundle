import React from 'react';
import PropTypes from 'prop-types';
import { FieldBase, fieldTypes, formFieldWrapper } from "@AndevisReactBundle/UI/Components/Form/Field";
import './Text.scss';
import { Component } from "@AndevisReactBundle/UI/ComponentBase";

class TextBase extends FieldBase {

    static propTypes = Object.assign({}, Component.propTypes, {
        autoComplete: PropTypes.string
    });

    static defaultProps = Object.assign({}, FieldBase.defaultProps, {
        type: 'text',
        autoComplete: 'off'
    });

    getShortClassName(){
        return 'Text';
    }

    getFieldControlProps(){
        let attr = Object.assign({}, super.getFieldControlProps(), {
            type: this.props.type,
            autoComplete: this.props.autoComplete
        });
        return attr;
    }
}

@formFieldWrapper
export default class Text extends TextBase {};

export {
    TextBase,
    Text
}
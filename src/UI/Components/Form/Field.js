import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from '../../ComponentBase/index';
import PropTypes from 'prop-types';
import InputWrapper from './InputWrapper';
import { Field as FieldApi } from 'react-form';
import { autobind } from 'core-decorators';
import { filterObjectByKeys } from "@AndevisReactBundle/UI/Helpers";
import './Field.scss';
import classNames from "classnames";

const fieldTypes = {
    name: PropTypes.string,
    enabled: PropTypes.bool,
    index: PropTypes.number,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.any,
    readOnly: PropTypes.any,
    helpText: PropTypes.string,
    inputProps: PropTypes.object,
    className: PropTypes.string,
    fieldApi: PropTypes.object,
    selectProps: PropTypes.object,
    inputProps: PropTypes.object,
    value: PropTypes.any,
    error: PropTypes.string,
    warning: PropTypes.string,
    success: PropTypes.string,
    autoComplete: PropTypes.string
};

const formFieldWrapper = (WrappedComponent) => {
    class FormField extends React.Component {

        static propTypes = fieldTypes;

        static contextTypes = Object.assign({}, Component.contextTypes, {
            formApi: PropTypes.object
        });

        constructor(props, context) {
            super(props, context);
            this.state = { showErrors: true };
        }

        render() {
            // let field = <WrappedComponent {...this.props} />;
            const className = classNames("form-input form-component", this.props.className);

            // Если поле обернуто формой, значение контролируется формой
            if (this.context.formApi && this.props.field) {
                const fieldProps = filterObjectByKeys(this.props, [
                    'enabled',
                    'value',
                    'readOnly',
                    'style',
                    'className',
                    'required',
                    'validation',
                    'defaultValue'
                ]);
                return (
                    <FieldApi field={this.props.field} {...fieldProps}>
                        {fieldApi => {
                            const error = (fieldApi && typeof fieldApi.error === 'string') ? fieldApi.error : null;
                            const warning = (fieldApi && typeof fieldApi.warning === 'string') ? fieldApi.warning : null;
                            const success = (fieldApi && typeof fieldApi.success === 'string') ? fieldApi.success : null;
                            return (
                                <WrappedComponent
                                    value={fieldApi.value}
                                    fieldApi={fieldApi}
                                    error={error}
                                    warning={warning}
                                    success={success}
                                    {...this.props}
                                />
                            );
                        }}
                    </FieldApi>
                );
            } else {
                return <WrappedComponent {...this.props} />;
            }
        }
    }

    return FormField;
};


class FieldBase extends Component {

    static propTypes = Object.assign({}, Component.propTypes, fieldTypes);

    static defaultProps = Object.assign({}, Component.defaultProps, {
        defaultValue: '',
        autoComplete: 'off',
        required: false
    });

    static contextTypes = Object.assign({}, Component.contextTypes, {
        form: PropTypes.object,
        formApi: PropTypes.object
    });

    constructor(props, context) {
        super(props, context);

        // Private changed flag
        this._changed = false;
        this._inputProcess = false;

        if (context.formApi && !props.field)
            console.error("Property `field` not set for form field component `" + this.getShortClassName() + ":" + this.getName() + "`");
    }

    static bundleName = 'React';

    getShortClassName() {
        return 'Field';
    }

    getFieldName() {
        if(!this.props.fieldApi){
            throw new Error('Can`t get field name. Component ' + this.getName() + ' is outside Form component');
        }
        return this.props.fieldApi.getFieldName();
    }

    // Attribute: value
    get value() {
        return this.getValue();
    }

    set value(value) {
        this.setValue(value);
    }

    /**
     * Set value
     * @param value
     */
    setValue(newValue){
        if (this.props.fieldApi) {
            this.props.fieldApi.setValue(newValue);
            // this.setAttributes({ value: newValue });
        } else {
            this.setAttributes({ value: newValue });
            // if( !this._inputProcess){
            //     this.change(newValue);
            // }
        }

        // return this.setAttributeValue('value', value).then(() => {
        //     this.change(value);
        // });
    }

    /**
     * Get value
     * @param value
     * @returns {*}
     */
    getValue(){
        return this.props.fieldApi ? (this.props.value || '') : this.getAttributeValue('value', this.props.defaultValue);
    }

    // Attribute: required
    get required() {
        return this.getAttributeValue('required', this.props.required);
    }

    set required(value) {
        this.setAttributeValue('required', value);
    }


    // Attribute: readOnly
    get readOnly() {
        return this.getAttributeValue('readOnly', this.props.readOnly);
    }

    set readOnly(value) {
        this.setAttributeValue('readOnly', value);
    }

    // componentWillReceiveProps(nextProps) {
    //     let currentValue = this.getValue();
    //     if (this.props.fieldApi) {
    //         const valueAttrName = this.getAttributeStateName('value');
    //         currentValue = this.state.hasOwnProperty(valueAttrName) && this.state[valueAttrName];
    //     }
    //     super.componentWillReceiveProps(nextProps);
    //     // if (nextProps.hasOwnProperty('value') && !this._inputProcess) {
    //     //     if (currentValue !== nextProps['value']) {
    //     //         this.change(nextProps['value']);
    //     //     }
    //     // }
    // }
    componentDidReceiveBackendState(prevState) {
        super.componentDidReceiveBackendState(prevState);
        const valueAttrName = this.getAttributeStateName('value');
        if(!this.props.fieldApi) {
            if(this.getValue() !== this.state[valueAttrName]){
                this.setValue(this.state[valueAttrName]);
            }
        }
    }
    //
    // componentWillReceiveBackendState(nextState) {
    //     super.componentWillReceiveBackendState(nextState);
    //
    //     const valueAttrName = this.getAttributeStateName('value');
    //     // Update field value if controlled by form
    //     if (nextState.hasOwnProperty(valueAttrName)) {
    //
    //     }
    //     if(this.props.fieldApi)
    //     {
    //         if(this.props.fieldApi.value !== nextState[valueAttrName]){
    //             this.props.fieldApi.setValue(nextState[valueAttrName]);
    //         }
    //
    //     } else {
    //         if(this.getValue() !== nextState[valueAttrName]){
    //             this.setValue(nextState[valueAttrName]);
    //         }
    //     }
    // }

    getAttributesLinkedToProps(){
        return super.getAttributesLinkedToProps().concat([
            'value', 'requried', 'readOnly'
        ])
    }

    eventList() {
        return super.eventList().concat(['click', 'doubleClick', 'change', 'input']);
    }

    inputNewValue(newValue) {
        if (this.props.fieldApi) {
            this.props.fieldApi.setValue(newValue);
            // this.setAttributes({ value: newValue });
        } else {
            this.setAttributes({ value: newValue });
        }
    }

    /**
     * Input event
     * @param newValue
     * @returns {*|Promise<any>}
     */
    @autobind
    input(newValue) {
        this._changed = true;
        return this.fireEvent('input', newValue)
    }

    /**
     * Focus event
     */
    @autobind
    focus(event) {
        if(event){
            return this.fireEvent('focus').then(() => this.setAttributes({hasFocus: true }) );
        } else {
            if (this.refInput && document.activeElement !== ReactDOM.findDOMNode(this.refInput) ) {
                this.refInput.focus();
            }
            // if(this.refInput)
            // {
            //     this.refInput.focus();
            // }
        }
    }

    /**
     * Change event
     * @param newValue
     * @returns {*|Promise<any>}
     */
    @autobind
    change(newValue) {
        this._changed = false;
        return this.fireEvent('change', newValue);
        /*
        return this.fireEvent('change', newValue).then(() => {
            this.inputNewValue(newValue);
        });*/
    }

    /**
     * Click event
     * @returns {Promise}
     */
    @autobind
    click() {
        return this.fireEvent('click');
    }

    /**
     * Double click event
     * @returns {Promise}
     */
    @autobind
    doubleClick() {
        return this.fireEvent('doubleClick');
    }

    @autobind
    handleClickEvent(event) {
        this.click();
    }

    @autobind
    handleInputEvent(event) {
        this._inputProcess = true;
        this.inputNewValue(event.target.value);
        this.input(event.target.value).finally(() => {
            this._inputProcess = false;
        });
    }

    @autobind
    handleBlurEvent(event) {
        const value = event.target.value;
        if (this.props.fieldApi) this.props.fieldApi.setTouched();
        this.blur().finally(() => {
            if (this._changed) this.change(value);
        });
    }

    @autobind
    handleFocusEvent(event) {
        this.focus(event);
    }

    @autobind
    handleKeyPress(event) {
        const value = event.target.value;
        if (event.key === 'Enter') {
            if (this._changed) this.change(value);
        }
        return true;
    }

    getFieldControlProps() {
        return Object.assign({
            ref: (input) => { this.refInput = input; },
            className: 'form-control',
            type: 'text',
            autoComplete: this.props.field || 'off',
            placeholder: this.props.placeholder,
            required: this.required,
            readOnly: this.readOnly,
            value: this.value || '',
            disabled: (
                this.backendEventProcessing ||
                (this.props.type == 'color' && this.readOnly) ||
                !this.enabled ||
                (
                    this.context.hasOwnProperty('form') &&
                    typeof this.context.form === Component &&
                    this.context.form.backendEventProcessing
                )
            ),
            // React change vs input
            // https://stackoverflow.com/questions/38256332/in-react-whats-the-difference-between-onchange-and-oninput
            onChange: this.handleInputEvent,
            onBlur: this.handleBlurEvent,
            onFocus: this.handleFocusEvent,
            onClick: this.click,
            onDoubleClick: this.doubleClick,
            onKeyPress: this.handleKeyPress
        }, this.props.inputProps);
    }

    getFieldWrapperProps(){
        return Object.assign(
            {
                className: 'form-component',
                hasFocus: this.hasFocus
            },
            filterObjectByKeys(this.props, [
                'style',
                'error',
                'warning',
                'success',
                'helpText',
                'className'
            ])
        );
    }

    render() {
        return (
            <InputWrapper {...this.getFieldWrapperProps()}>
                <input {...this.getFieldControlProps()} />
            </InputWrapper>
        );
    }
}

@formFieldWrapper
class Field extends FieldBase { }


export default Field;
export {
    Field,
    FieldBase,
    fieldTypes,
    formFieldWrapper
}

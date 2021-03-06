import React from 'react';
import { Component } from '../../ComponentBase/index';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import './FormInputBase.scss';

const Tooltip = ({ styleClass, message, show }) => (
    <div
        className={classNames("tooltip fade bottom in", styleClass)}
        style={{display: show ? 'block' : 'none'}}
        role="tooltip">
        <div className="tooltip-arrow" style={{left: "50%"}} />
        <div className="tooltip-inner">{message}</div>
    </div>
);

const InputWrapper = (props) => {
    const fieldApi  = props.fieldApi;
    const error     = (fieldApi && typeof fieldApi.getError() === 'string') ? fieldApi.getError() : null;
    const warning   = (fieldApi && typeof fieldApi.getWarning() === 'string') ? fieldApi.getWarning() : null;
    const success   = (fieldApi && typeof fieldApi.getSuccess() === 'string') ? fieldApi.getSuccess() : null;
    const hasError = (error);
    const hasWarning = (!error && warning);
    const hasSuccess = (!error && !warning && success);

    return (
        <div className={classNames("form-input form-component", props.className, {
            "has-error": hasError,
            "has-warning": hasWarning,
            "has-success": hasSuccess,
        })}>
            {props.children}
            {hasError && (<Tooltip styleClass="danger" message={error} show={props.hasFocus}/>)}
            {hasWarning ? <Tooltip styleClass="warning" message={warning} show={props.hasFocus}/> : null}
            {hasSuccess ? <Tooltip styleClass="success" message={success} show={props.hasFocus}/> : null}
            {props.helpText && <p className="help-block">{props.helpText}</p>}
        </div>
    );
};

// TODO: rename to Field
class FormInputBase extends Component {

    static propTypes = Object.assign({}, Component.propTypes, {
        required: PropTypes.bool,
        placeholder: PropTypes.string,
        defaultValue: PropTypes.any,
        readOnly: PropTypes.any,
        helpText: PropTypes.string,
        type: PropTypes.string,
        autoComplete: PropTypes.string,
        className: PropTypes.string,
        inputClassName: PropTypes.string
    });

    static defaultProps = Object.assign({}, Component.defaultProps, {
        type: 'text',
        autoComplete: 'off'
    });


    static contextTypes = Object.assign({}, Component.contextTypes, {
        form: PropTypes.object,
        formApi: PropTypes.object,
        fieldApi: PropTypes.object
    });

    constructor(props, context) {
        super(props, context);
        if (!props.fieldApi || !props.fieldApi.getFieldName())
            console.error("Property `field` not set for Text component `" + this.getName() + "`");
    }

    static bundleName = 'React';

    getFieldName(){
        return this.props.fieldApi.getFieldName();
    }

    // Attribute: value
    get value() {
        this.getAttributeValue('value', this.props.value);
        // if (this.props.fieldApi) {
        //     return this.props.fieldApi.getValue();
        //     // return formValue;
        //     // return typeof formValue === 'string' ? formValue : '';
        // } else {
        //
        // }
    }
    set value(value) {
        if(this.props.fieldApi){
            this.props.fieldApi.setValue(value);
        }
        // Fixed for select (TODO: optimize render when state change by form Api and state
        this.setAttributeValue('value', value);
    }

    componentWillUpdate(nextProps, nextState){
        const attrValue = this.getAttributeStateName('value');
        if(nextState.hasOwnProperty(attrValue)){
            if(nextState[attrValue] !== this.props.fieldApi.getValue()){
                this.props.fieldApi.setValue(nextState[attrValue]);
            }
        }
    }

    eventList() {
        return super.eventList().concat(['click', 'change', 'input']);
    }

    click() {
        return this.fireEvent('click');
    }

    /**
     * Change event
     * @param newValue
     * @returns {*|Promise<any>}
     */
    change(newValue) {
        return this.fireEvent('change', newValue).then(() => {
            this.setAttributes({ value: newValue });
        });
    }

    @autobind
    handleOnClickEvent(event) {
        this.click(event);
    }

    @autobind
    handleOnInputEvent(event) {
        this.change(event.target.value);
    }

    @autobind
    handleOnBlurEvent(event) {
        if (this.props.fieldApi) this.props.fieldApi.setTouched();
        this.blur();
    }

    @autobind
    handleOnFocusEvent(event) {
        this.focus();
    }

    // TODO: вызывать когда пользователь закончил ввод
    // https://stackoverflow.com/questions/38256332/in-react-whats-the-difference-between-onchange-and-oninput
    @autobind
    handleOnChangeEvent(event) {
        this.change(event.target.value);
    }

    render() {
        return (
            <InputWrapper hasFocus={this.hasFocus} {...this.props}>
                <input
                    type={"text"}
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
                    disabled={this.backendEventProcessing || !this.enabled || this.context.form.backendEventProcessing}
                />
            </InputWrapper>
        );
    }
}

export default Text;
export {
    Tooltip,
    InputWrapper,
    FormInputBase
}
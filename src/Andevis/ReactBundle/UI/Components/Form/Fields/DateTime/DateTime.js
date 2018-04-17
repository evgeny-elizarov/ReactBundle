import React from 'react';
import classNames from 'classnames';
import { FieldBase, formFieldWrapper } from "@AndevisReactBundle/UI/Components/Form/Field";
import Component from '@AndevisReactBundle/UI/ComponentBase/Component';
import InputWrapper from "@AndevisReactBundle/UI/Components/Form/InputWrapper";
import {autobind} from 'core-decorators';
import Datetime from 'react-datetime';
import Moment from 'moment';
import PropTypes from 'prop-types';
import {filterObjectByKeys} from "@AndevisReactBundle/UI/Helpers";
import './DateTime.scss';

class DateTimeBase extends FieldBase {

    static propTypes = Object.assign({}, FieldBase.propTypes, {
        dateFormat: PropTypes.any,
        valueDateTimeFormat: PropTypes.string,
        timeFormat: PropTypes.any,
        inputProps: PropTypes.object,
        // closeOnSelect: PropTypes.bool
    });

    static defaultProps = Object.assign({}, FieldBase.defaultProps, {
        dateFormat: 'DD.MM.YYYY',
        timeFormat: 'HH:mm:ss',
        closeOnSelect: true
    });

    static contextTypes = Object.assign({}, FieldBase.contextTypes, {
        locale: PropTypes.string
    });
    //
    // getInitialState(){
    //     return {
    //         open: false
    //     }
    // }

    static bundleName = 'React';

    getShortClassName(){
        return 'DateTime';
    }

    getInputFormat() {
        let format = "";
        if (this.props.dateFormat)
            format = this.props.dateFormat;
        if (this.props.timeFormat)
            format += " " + this.props.timeFormat;
        return format;
    }

    // getValueFormat() {
    //     let format = "";
    //     if (this.props.valueDateTimeFormat) {
    //         format = this.props.valueDateTimeFormat;
    //     } else {
    //         if (this.props.dateFormat)
    //             format = this.props.dateFormat;
    //         if (this.props.timeFormat)
    //             format += " " + this.props.timeFormat;
    //     }
    //     return format;
    // }

    // @autobind
    // handleOnInputEvent(datetime) {
    //     let value = null;
    //     const isWritable = (!this.props.hasOwnProperty('readOnly') || !this.props.readOnly);
    //     if (isWritable) {
    //         if (datetime) {
    //             value = datetime.format(this.getValueFormat());
    //         }
    //         this.value = value;
    //         this.change(value);
    //     }
    // }

    /**
     * Focus event
     */
    @autobind
    focus() {
        return super.focus().then(() => {
           this.setState({ open: true });
        });
    }

    /**
     * Blur event
     */
    @autobind
    blur() {
        return super.blur().then(() => {
            this.setState({ open: false });
        });
    }

    @autobind
    handleDateTimeChangeEvent(input){
        if(!this.readOnly)
        {
            this._inputProcess = true;
            let value = input;
            if(typeof input === 'object'){
                value = input.format(this.getInputFormat());
            }
            this.setValue(value);
            this.input(value).finally(() => {
                this._inputProcess = false;
            });
        }
    }

    @autobind
    handleDateTimeBlurEvent(input) {
        if(!this.readOnly)
        {
            let value = input;
            if(typeof input === 'object'){
                value = input.format(this.getInputFormat());
            }

            if (this.props.fieldApi) this.props.fieldApi.setTouched();
            this.blur().finally(() => {
                if (this._changed) this.change(value);
            });
        }
    }

    getFieldWrapperProps(){
        let props = super.getFieldWrapperProps();
        props.className += ' dateTime-form-component';
        return props;
    }

    getFieldControlProps(){
        if(this.readOnly){
            return super.getFieldControlProps();
        } else {
            const inputProps = Object.assign({
                className: 'form-control',
                placeholder: this.props.placeholder,
                required: this.required,
                readOnly: this.readOnly,
                onFocus: this.handleFocusEvent,
                disabled: (
                    this.backendEventProcessing ||
                    !this.enabled ||
                    (
                        this.context.hasOwnProperty('form') &&
                        typeof this.context.form === Component &&
                        this.context.form.backendEventProcessing
                    )
                )
            }, this.props.inputProps)

            return Object.assign({
                value: this.value,
                inputProps: inputProps,
                onChange: this.handleDateTimeChangeEvent,
                onBlur: this.handleDateTimeBlurEvent,
                // renderInput: (props, openCalendar, closeCalendar) => {
                //     return (
                //         <div>
                //             <input {...props} />
                //             <button onClick={openCalendar}>open calendar</button>
                //             <button onClick={closeCalendar}>close calendar</button>
                //         </div>
                //     );
                // },
                // onClick: this.click,
                // onDoubleClick: this.doubleClick,
                closeOnSelect: true
                // onKeyPress: this.handleKeyPress
            },  filterObjectByKeys(this.props, [
                'locale', 'dateFormat', 'timeFormat'
            ]));
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        // FIX: запрещает перерисовку компонетна при изменении значения, (иначе залипават видлжет выбора времени
        return !(this._inputProcess);
    }

    render() {
        if(this.readOnly) {
            return super.render();
        } else {
            return (
                <InputWrapper {...this.getFieldWrapperProps()}>
                    <Datetime {...this.getFieldControlProps()} />
                </InputWrapper>
            );
        }
    }
}

@formFieldWrapper
class DateTime extends DateTimeBase {}

export default DateTime;
export {
    DateTimeBase,
    DateTime
}

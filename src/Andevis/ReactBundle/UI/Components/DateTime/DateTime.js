import React from 'react';
import classNames from 'classnames';
import {FormInputBase, InputWrapper} from "@AndevisReactBundle/UI/Components/Form/FormInputBase";
import {FormField} from 'react-form';
import {autobind} from 'core-decorators';
import Datetime from 'react-datetime';
import PropTypes from 'prop-types';
import {filterObjectByKeys} from "@AndevisReactBundle/UI/Helpers";
import './DateTime.scss';


class DateTimeBase extends FormInputBase {

    static propTypes = Object.assign({}, FormInputBase.propTypes, {
        dateFormat: PropTypes.any,
        valueDateTimeFormat: PropTypes.string,
        timeFormat: PropTypes.any,
    });

    static defaultProps = Object.assign({}, FormInputBase.defaultProps, {
        dateFormat: 'DD.MM.YYYY',
        timeFormat: 'HH:mm:ss',
    });

    static contextTypes = Object.assign({}, FormInputBase.contextTypes, {
        locale: PropTypes.string
    });

    getBundleName() {
        return 'React';
    }

    getInputFormat() {
        let format = "";
        if (this.props.dateFormat)
            format = this.props.dateFormat;
        if (this.props.timeFormat)
            format += " " + this.props.timeFormat;
        return format;
    }

    getValueFormat() {
        let format = "";
        if (this.props.valueDateTimeFormat) {
            format = this.props.valueDateTimeFormat;
        } else {
            if (this.props.dateFormat)
                format = this.props.dateFormat;
            if (this.props.timeFormat)
                format += " " + this.props.timeFormat;
        }
        return format;
    }

    @autobind
    handleOnInputEvent(datetime) {
        let value = null;
        const isWritable = (!this.props.hasOwnProperty('readOnly') || !this.props.readOnly);
        if (isWritable) {
            if (datetime) {
                value = datetime.format(this.getValueFormat());
            }
            this.value = value;
            this.change(value);
        }
    }

    render() {

        const locale = (this.context.locale) ? this.context.locale : null;

        let dateProps = filterObjectByKeys(this.props, [
            'locale', 'dateFormat', 'timeFormat', 'open']);

        // Take context locale if not set
        if (!dateProps.locale && this.context.locale)
            dateProps.locale = this.context.locale;

        let props = Object.assign({}, this.props);
        if (!props.placeholder)
            props.placeholder = this.getValueFormat();

        props.className = classNames(props.className, "form-input-datetime");

        const inputProps = filterObjectByKeys(props, ['readOnly', 'placeholder']);

        return (
            <InputWrapper hasFocus={this.hasFocus} {...props}>
                <Datetime
                    ref="Datetime"
                    value={this.value}
                    onChange={this.handleOnChangeEvent}
                    locale={locale}
                    inputProps={inputProps}
                    /* onBlur={() => setTouched()} Disabled setTouched calls onChange event for whole form */
                    /*{...dateProps}*/
                    />
            </InputWrapper>
        );
    }
}


@FormField
class DateTime extends DateTimeBase {
}

export default DateTime;
export {
    DateTimeBase,
    DateTime
}

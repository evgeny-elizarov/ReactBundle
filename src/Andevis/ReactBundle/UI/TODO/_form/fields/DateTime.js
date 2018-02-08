/**
 * Created by EvgenijE on 03.07.2017.
 */
import React from 'react';
import { FormInput } from 'react-form';
import Datetime from 'react-datetime';
import { filterObjectByKeys } from '../../../Helpers';
import PropTypes from 'prop-types';
import moment from 'moment';
import './DateTime.css';

class DateTime extends React.Component {

    render() {
        const dateProps = filterObjectByKeys(this.props, [ 'locale', 'dateFormat', 'timeFormat', 'open' ]);
        const inputProps = filterObjectByKeys(this.props, [ 'readOnly' ]);
        inputProps.onKeyPress = (e) => {
            // Hide calender when press ENTER
            if(e.key === 'Enter') {
                this.datetimeCtrl.setState({
                    open: false
                });
            }
        };
        if(inputProps.hasOwnProperty('readOnly')) {
            dateProps.open = false;
        }
        return (
            <FormInput {...this.props}>
                {({ setValue, getValue, setTouched }) => {
                    let val = getValue();
                    if(val) val = moment(getValue());
                    return (
                        <Datetime
                            ref={(datetimeCtrl) => { this.datetimeCtrl = datetimeCtrl; }}
                            value={val}
                            onChange={datetime => {
                                let val = null;

                                if(!inputProps.hasOwnProperty('readOnly'))
                                {
                                    if(datetime) {
                                        val = datetime.format(this.props.valueDateTimeFormat);
                                    }
                                }
                                setValue(val);

                                if(this.props.onChange)
                                    this.props.onChange(datetime);

                            }}
                            inputProps={inputProps}
                            /* onBlur={() => setTouched()} Disabled setTouched calls onChange event for whole form */
                            {...dateProps} />
                    )
                }}
            </FormInput>
        )
    }
}

DateTime.propTypes = {
    dateFormat: PropTypes.any,
    valueDateTimeFormat: PropTypes.string,
    timeFormat: PropTypes.any,
    readOnly: PropTypes.any,
    onChange: PropTypes.func
};

DateTime.defaultProps = {
    locale: 'et',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm:ss',
    valueDateTimeFormat: 'YYYY-MM-DD HH:mm:ss'
};

export {
    DateTime
}
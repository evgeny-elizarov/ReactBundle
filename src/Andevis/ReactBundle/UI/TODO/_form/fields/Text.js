/**
 * Created by EvgenijE on 28.06.2017.
 */
import React from 'react';
import { FormInput } from 'react-form';
import { filterObjectByKeys } from '../../../Helpers';
import PropTypes from 'prop-types';

class Text extends React.Component {

    render() {
        const inputProps = filterObjectByKeys(
            this.props,
            ['readOnly', 'className', 'style', 'accept', 'placeholder', 'required', 'autofocus']
        );
        return (
            <FormInput {...this.props}>
                {({ setValue, getValue, setTouched }) => {
                    let val = getValue();
                    if (val == null) val = '';
                    let props = {};
                    if (inputProps.hasOwnProperty('readOnly') && inputProps.readOnly) {
                        props.value = val;
                    } else {
                        props.value = val;
                        props.onChange = (e) => {
                            setValue(e.target.value);
                            if (this.props.onChange)
                                this.props.onChange(e.target.value);
                        };
                        /* props.onBlur = () => { setTouched()}; Disabled setTouched calls onChange event for whole form */
                    }
                    return (
                        <input
                            type="text"
                            className="form-control"
                            {...inputProps}
                            {...props}
                        />
                    )
                }}
            </FormInput>
        )
    }
}

Text.propTypes = {
    onChange: PropTypes.func
};


export {
    Text
}
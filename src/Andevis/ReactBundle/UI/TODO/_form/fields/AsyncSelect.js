/**
 * Created by EvgenijE on 05.07.2017.
 */
import React from 'react';
import { FormInput } from 'react-form';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { filterObjectByKeys } from '../../../Helpers';
import { translatable } from '../../../decorators/i18n';
import classNames from 'classnames';


class AsyncSelect extends React.Component {

    render() {
        const formInputProps = filterObjectByKeys(this.props, [ 'field' ]);
        const selectProps = filterObjectByKeys(this.props, [ 'value', 'className', 'disabled' ]);
        const selectHandlers = filterObjectByKeys(this.props, [ 'onChange' ]);
        const inputProps = filterObjectByKeys(this.props, [ 'style', 'readOnly' ]);
        const loadOptions = this.props.loadOptions;
        let className = classNames(selectProps.className, {
            readonly: inputProps.hasOwnProperty('readOnly')
        });
        if(inputProps.hasOwnProperty('readOnly')) {
            selectProps.disabled = true;
        }
        return (
            <FormInput {...formInputProps}>
                {({ setValue, getValue, setTouched }) => {
                    let val = getValue();
                    if (val == null) val = '';
                    return (
                        <Select.Async
                            value={ val }
                            /* onBlur={() => setTouched()} Disabled setTouched calls onChange event for whole form */
                            placeholder={this.i18n('Select...')}
                            loadingPlaceholder={this.i18n('Loading...')}
                            loadOptions={(input, callback) => {
                                if(loadOptions)
                                    loadOptions(input, callback, val);
                            }}
                            inputProps={inputProps}
                            className={className}
                            ignoreAccents={false}
                            onChange={(option) => {
                                if(option) val = option.value;
                                else val = '';
                                // Convert special charaster to HTML
                                setValue(val);
                                if(selectHandlers.onChange)
                                    selectHandlers.onChange(option);
                            }}
                            {...selectProps}
                        />
                    )
                }}
            </FormInput>
        )
    }
}

AsyncSelect.propTypes = {
    field: PropTypes.string.isRequired,
    loadOptions: PropTypes.func.isRequired,
    style: PropTypes.object
};


export default translatable('components.form.fields.AsyncSelect')(AsyncSelect)

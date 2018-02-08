/**
 * Created by EvgenijE on 28.06.2017.
 */
import React from 'react';
import { FormInput } from 'react-form';
import PropTypes from 'prop-types';
import { filterObjectByKeys } from '../../../Helpers';

/**
 * Map select options
 * @param arr
 * @param callback
 * @param empty
 */
function mapSelectOptions(arr, callback, empty) {
    let options = [];

    if(typeof empty !== 'undefined')
    {
        if(Array.isArray(empty)) {
            if(empty.length === 1)
            {
                options.push({
                    value: empty[0],
                    label: empty[0]
                });
            } else if(empty.length === 2) {
                options.push({
                    value: empty[0],
                    label: empty[1]
                });
            } else {
                const object = empty[0];
                const label = empty[1];
                const key = empty[2];
                options.push({
                    key: key,
                    value: object[key],
                    label: label,
                    object: object
                });
            }

        } else {
            options.push({
                value: '',
                label: empty,
                object: null
            });
        }
    }

    let map = arr.map(callback);

    map.forEach((item) => {
        if(Array.isArray(item))
        {
            if(item.length === 1)
            {
                options.push({
                    value: item[0],
                    label: item[0]
                });
            } else if(item.length === 2) {
                options.push({
                    value: item[0],
                    label: item[1]
                });
            } else {
                const object = item[0];
                const label = item[1];
                const key = item[2];
                options.push({
                    key: key,
                    value: object[key],
                    label: label,
                    object: object
                });
            }
        } else {
            options.push({
                value: item,
                label: item,
                object: item
            });
        }
    });
    return options;
}

class Select extends React.Component {

    render() {
        const options = this.props.options;
        const formInputProps = filterObjectByKeys(this.props, [ 'field', 'onChange' ]);
        const inputProps = filterObjectByKeys(this.props, [ 'className', 'readOnly', 'disabled' ]);
        if(inputProps.hasOwnProperty('readOnly')) {
            inputProps.disabled = 'disabled';
        }

        if(inputProps.hasOwnProperty('className')) {
            inputProps.className += ' form-control';
        } else {
            inputProps.className = 'form-control';
        }

        return (
            <FormInput {...formInputProps}>
                {({ setValue, getValue, setTouched }) => {

                    // find default value
                    const val = getValue();
                    let defaultValue = null;
                    const defaultOption = options.find((opt) => {
                        if(opt.hasOwnProperty('key')) {
                            return opt.value === ((typeof val === 'undefined') ? null : val[opt.key]);
                        } else {
                            return opt.value === val;
                        }
                    });

                    if(defaultOption) {
                        defaultValue = defaultOption.value;
                    }

                    return (
                        <select
                            className="form-control"
                            onChange={(e) => {
                                const selectedOption = options.find((opt) => {
                                    let value = e.target.value;
                                    if(typeof opt.value === 'boolean') {
                                        value = (e.target.value === 'true');
                                    }
                                    else if(typeof opt.value === 'number') {
                                        value = Number(e.target.value);
                                    }
                                    return opt.value === value;
                                });
                                if(selectedOption) {
                                    if(selectedOption.hasOwnProperty('key'))
                                    {
                                        setValue(selectedOption.object);
                                    } else {
                                        setValue(selectedOption.value);
                                    }
                                }
                                if(this.props.onChange)
                                    this.props.onChange(e.target.value);
                            }}
                            defaultValue={defaultValue}
                            /* onBlur={() => setTouched()} Disabled setTouched calls onChange event for whole form */
                            {...inputProps}>
                            {options.map((opt, i) =>
                                <option key={i} value={opt.value}>{opt.label}</option>
                            )}
                        </select>
                    )
                }}
            </FormInput>
        )
    }
}

Select.propTypes = {
    options: PropTypes.array.isRequired,
    onClick: PropTypes.func,
    onChange: PropTypes.func
};

export {
    Select,
    mapSelectOptions
}

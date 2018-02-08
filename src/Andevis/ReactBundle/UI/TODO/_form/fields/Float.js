/**
 * Created by vlarja on 10/07/2017.
 */
import React from 'react';
import { FormInput } from 'react-form';
import { filterObjectByKeys } from '../../../Helpers';


class Float extends React.Component {

    render() {
        const inputProps = filterObjectByKeys(this.props, [ 'readOnly', 'className', 'style', 'step' ]);
        return (
            <FormInput {...this.props}>
                {({ setValue, getValue, setTouched }) => {
                    let val = getValue();
                    if(val == null) val = '';
                    return (
                        <input
                            type="number"
                            className="form-control"
                            value={ val }
                            onChange={e => setValue(parseFloat(e.target.value))}
                            /* onBlur={() => setTouched()} Disabled setTouched calls onChange event for whole form */
                            {...inputProps}
                        />
                    )
                }}
            </FormInput>
        )
    }
}

Float.defaultProps = {
    step: 0.01
};

export {
    Float
}
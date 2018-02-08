/**
 * Created by EvgenijE on 04.07.2017.
 */
import React from 'react';
import { FormInput } from 'react-form';
import { filterObjectByKeys } from '../../../Helpers';

class TextArea extends React.Component {

    render() {
        const inputProps = filterObjectByKeys(this.props, [ 'rows', 'className', 'style', 'readOnly' ]);
        return (
            <FormInput {...this.props}>
                {({ setValue, getValue, setTouched }) => {
                    let val = getValue();
                    if(val == null) val = '';
                    return (
                        <textarea
                            type="text"
                            className="form-control"
                            value={ val }
                            onChange={e => {
                                setValue(e.target.value)
                            }}
                            /* onBlur={() => setTouched()} Disabled setTouched calls onChange event for whole form */
                            {...inputProps}
                        />
                    )
                }}
            </FormInput>
        )
    }
}

export {
    TextArea
}

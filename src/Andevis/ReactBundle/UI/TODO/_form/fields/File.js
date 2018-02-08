/**
 * Created by eeliz on 11.07.2017.
 */
import React from 'react';
import { FormInput } from 'react-form';
import { filterObjectByKeys } from '../../../Helpers';

class File extends React.Component {

    render() {
        const inputProps = filterObjectByKeys(this.props, [ 'readOnly', 'className', 'style', 'accept' ]);
        return (
            <FormInput {...this.props}>
                {({ setValue, setTouched }) => {
                    return (
                        <input
                            type="file"
                            className="form-control"
                            onChange={e => {
                                setValue(e.target.files[0]);
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
    File
}

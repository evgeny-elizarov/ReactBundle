/**
 * Created by EvgenijE on 28.06.2017.
 */
import React from 'react';
import { FormInput } from 'react-form';


class Email extends React.Component {
    render() {
        return (
            <FormInput {...this.props}>
                {({ setValue, getValue, setTouched }) => {
                    return (
                        <input
                            className="form-control"
                            type="email"
                            value={getValue()}
                            onChange={e => setValue(e.target.value)}
                            /* onBlur={() => setTouched()} Disabled setTouched calls onChange event for whole form */
                        />
                    )
                }}
            </FormInput>
        )
    }
}

export {
    Email
}
/**
 * Created by EvgenijE on 28.06.2017.
 */
import React from 'react';
import { FormInput } from 'react-form';
import { filterObjectByKeys } from '../../../Helpers';

class Password extends React.Component {
    focus() {
        // Explicitly focus the text input using the raw DOM API
        this.textInput.focus();
    }

    render() {
        const inputProps = filterObjectByKeys(
            this.props,
            ['readOnly', 'className', 'style', 'accept', 'placeholder', 'required', 'autofocus']
        );
        return (
            <FormInput {...this.props}>
                {({ setValue, getValue, setTouched }) => {
                    let val = getValue();
                    if(val == null) val = '';
                    return (
                        <input
                            className="form-control"
                            type="password"
                            value={val}
                            ref={(input) => { this.textInput = input; }}
                            onChange={e => setValue(e.target.value)}
                            {...inputProps}
                            /* onBlur={() => setTouched()} Disabled setTouched calls onChange event for whole form */
                        />
                    )
                }}
            </FormInput>
        )
    }
}

export {
    Password
}
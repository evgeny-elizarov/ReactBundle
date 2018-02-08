import React from 'react';
import { FormField as FormFieldDecorator } from 'react-form';
import PropTypes from 'prop-types';

const FormField = (WrappedComponent) => {

    class FormField extends React.Component {
        static contextTypes = {
            form: PropTypes.object,
        };

        render() {
            let Component = (this.context.form) ?
                FormFieldDecorator(WrappedComponent) : WrappedComponent;
            return <Component {...this.props} />
        }
    }
    return FormField;
};

export  {
    FormField
}
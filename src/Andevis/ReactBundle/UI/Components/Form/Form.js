import React from 'react';
import {Component} from './../../ComponentBase';
import {Form as ReactForm} from 'react-form';
import {autobind} from 'core-decorators';
import PropTypes from 'prop-types';
import Loader from 'react-loader-advanced';
import './Field.scss';

export default class Form extends Component {

    static propTypes = Object.assign({}, Component.propTypes, {
        defaultValues: PropTypes.any,
        onFormUpdate: PropTypes.func,
    });

    static childContextTypes = Object.assign({}, Component.childContextTypes, {
        form: PropTypes.object,
    });

    _backendUpdate = false;
    // constructor(props, context){
    //     super(props, context);
    //     this.state = Object.assign({}, this.state, {
    //
    //     });
    // }

    getChildContext() {
        return {
            form: this
        }
    }

    static bundleName = 'React';

    // Attribute: isProcessing
    // get isProcessing() {
    //     return this.getAttributeValue('isProcessing', false);
    // }
    // set isProcessing(value) {
    //     this.setAttributeValue('isProcessing', value);
    // }

    /**
     * Attribute: values
     * @returns {*}
     */
    get values() {
        return this.getAttributeValue('values', this.props.defaultValues);
    }
    set values(value) {
        this.setAttributeValue('values', value);
    }

    /**
     * Attribute: errors
     * @returns {*}
     */
    get errors() {
        return this.getAttributeValue('errors', {});
    }
    set errors(value) {
        this.setAttributeValue('errors', value);
    }

    /**
     * Attribute: warnings
     * @returns {*}
     */
    get warnings() {
        return this.getAttributeValue('warnings', {});
    }
    set warnings(value) {
        this.setAttributeValue('warnings', value);
    }

    /**
     * Attribute: successes
     * @returns {*}
     */
    get successes() {
        return this.getAttributeValue('successes', {});
    }
    set successes(value) {
        this.setAttributeValue('successes', value);
    }

    eventList() {
        return super.eventList().concat(['change', 'submit', 'clean', 'validateErrors', 'reset']);
    }

    /**
     * Change event
     */
    @autobind
    change(formState) {
        return this.fireEvent('change', formState.values);
    }

    /**
     * Submit event
     */
    @autobind
    submit() {
        return this.fireEvent('submit', this.getValues());
    }

    @autobind
    handleFormSubmitEvent(e){
        e.preventDefault();
        // Update values for backend state
        this.setAttributes({
            values: this.getValues()
        }).then(() => {
            this.submit();
        });
    }

    @autobind
    resetEventHandler(event, values) {
        this.reset(values);
    }

    /**
     * Reset form
     * @param values
     */
    reset(values) {
        return this.fireEvent('reset', values).then(() => {
            this.resetAll();
        })
    }

    /**
     * Get form values
     * @returns {{}}
     */
    getValues() {
        return (this.formApi) ? this.formApi.values : this.values;
    }

    /**
     * Reset all
     */
    resetAll() {
        this.formApi.resetAll();
        // this.formApi.setAllValues(this.props.defaultValues);
    }

    // TODO: rename to setValues
    setAllValues(values) {
        if (this.formApi) {
            this.formApi.setAllValues(values);
        } else {
            throw new Error('formApi not set!');
        }
    }

    setValues(values) {
        if (this.formApi) {
            this.formApi.setAllValues(values);
        } else {
            throw new Error('formApi not set!');
        }
    }

    getStateForEvent(){
        let state = Object.assign({}, this.state);

        // Get lastest valuse from formApi
        if(this.formApi){
            const attrValues = this.getAttributeStateName('values');
            const formState = this.formApi.getFormState();
            state[attrValues] = formState.values;
        }
        return state;
    }


    // prepareStateAfterEvent(nextState){
    //     console.log(this.getName(), "prepareStateAfterEvent");
    //     // console.log("prepareStateAfterEvent", nextState);
    //     // Когда изменяется состояние (допустим после события на бэкенде)
    //     // устанавливаем значения для formApi
    //     if(this.formApi && nextState){
    //
    //         let formState = this.formApi.getFormState();
    //         let formStateChanged = false;
    //         const attrValues = this.getAttributeStateName('values');
    //         const attrErrors = this.getAttributeStateName('errors');
    //         const attrWarnings = this.getAttributeStateName('warnings');
    //         const attrSuccesses = this.getAttributeStateName('successes');
    //         if (
    //             nextState.hasOwnProperty(attrValues) &&
    //             nextState[attrValues] !== formState.values
    //         ) {
    //             formState.values = nextState[attrValues];
    //             formStateChanged = true;
    //         }
    //
    //         if(
    //             nextState.hasOwnProperty(attrErrors) &&
    //             nextState[attrErrors] !== formState.errors
    //         ) {
    //             formState.errors = nextState[attrErrors];
    //             formStateChanged = true;
    //         }
    //
    //         if(
    //             nextState.hasOwnProperty(attrWarnings) &&
    //             nextState[attrWarnings] !== formState.warnings
    //         ) {
    //             formState.warnings = nextState[attrWarnings];
    //             formStateChanged = true;
    //         }
    //
    //         if(
    //             nextState.hasOwnProperty(attrSuccesses) &&
    //             nextState[attrSuccesses] !== formState.successes
    //         ) {
    //             formState.successes = nextState[attrSuccesses];
    //             formStateChanged = true;
    //         }
    //
    //         if(formStateChanged) {
    //             console.log("setFormState 3", formState);
    //             this.formApi.setFormState(formState);
    //         }
    //
    //     }
    //     return nextState;
    // }

    // componentWillUpdate(nextProps, nextState) {
    //     console.log(this.getName(), "componentWillUpdate");
    //     if(this.formApi)
    //     {
    //         let formState = this.formApi.getFormState();
    //
    //
    //         // const newFormState = {};
    //         //
    //         // const attrValues = this.getAttributeStateName('values');
    //         // if(formState.values !== nextState[attrValues]) {
    //         //     newFormState[attrValues] = nextState[attrValues]
    //         // }
    //         //
    //         // const attrErrors = this.getAttributeStateName('errors');
    //         // if(formState.errors !== nextState[attrErrors]) {
    //         //     newFormState[attrErrors] = nextState[attrErrors]
    //         // }
    //         //
    //         // if(Object.keys(newFormState).length > 0)
    //         // {
    //         //     this.formApi.setFormState(Object.assign({}, formState, newFormState));
    //         // }
    //
    //
    //         let newFormState = {};
    //
    //         const valuesAttrName = this.getAttributeStateName('values');
    //         if(nextState[valuesAttrName] !== formState[valuesAttrName]){
    //             newFormState['values'] = nextState[valuesAttrName];
    //             // this.formApi.setAllValues(nextState[valuesAttrName]);
    //         }
    //
    //         const errorsAttrName = this.getAttributeStateName('errors');
    //         // if(nextState.hasOwnProperty(errorsAttrName)){
    //         if(nextState[errorsAttrName] !== formState[errorsAttrName]){
    //             newFormState['errors'] = nextState[errorsAttrName];
    //             // Object.keys(nextState[errorsAttrName]).map((key) => {
    //             //     this.formApi.setError(key, nextState[errorsAttrName][key]);
    //             // });
    //         }
    //
    //         const warringisAttrName = this.getAttributeStateName('warringis');
    //         if(nextState[warringisAttrName] !== formState[warringisAttrName]){
    //             newFormState['warringis'] = nextState[errorsAttrName];
    //             // Object.keys(nextState[warringisAttrName]).map((key) => {
    //             //     this.formApi.setWarning(key, nextState[warringisAttrName][key]);
    //             // });
    //         }
    //
    //         const successesAttrName = this.getAttributeStateName('successes');
    //         if(nextState[successesAttrName] !== formState[successesAttrName]){
    //             newFormState['successes'] = nextState[errorsAttrName];
    //             // Object.keys(nextState[successesAttrName]).map((key) => {
    //             //     this.formApi.setSuccess(key, nextState[successesAttrName][key]);
    //             // });
    //         }
    //
    //         if(Object.keys(newFormState).length > 0){
    //             console.log("setFormState 1", Object.assign({}, formState, newFormState));
    //             this.formApi.setFormState(Object.assign({}, formState, newFormState));
    //         }
    //     }
    //
    //
    //
    //     // console.log('componentWillUpdate', nextProps, nextState);
    //     // if(nextProps.defaultValues !== this.props.defaultValues){
    //     //
    //     //     formState.values = nextProps.defaultValues;
    //     //     this.values = nextProps.defaultValues;
    //     //     this.formApi.setFormState(formState);
    //     // } else {
    //     //     const attrValues = this.getAttributeStateName('values');
    //     //     const nextStateValues = (nextState.hasOwnProperty(attrValues)) ? nextState[attrValues] : null;
    //     //     if(formState.values !== nextStateValues){
    //     //         nextState[attrValues] = formState.values;
    //     //     }
    //     // }
    // }

    componentWillReceiveBackendState(nextState) {
        super.componentWillReceiveBackendState(nextState);

        let formState = this.formApi.getFormState();
        let newFormState = {};

        const valuesAttrName = this.getAttributeStateName('values');
        if(nextState.hasOwnProperty(valuesAttrName)){
            newFormState['values'] = nextState[valuesAttrName];
        }

        const errorsAttrName = this.getAttributeStateName('errors');
        if(nextState.hasOwnProperty(errorsAttrName)){
            newFormState['errors'] = nextState[errorsAttrName];
        }

        const warringisAttrName = this.getAttributeStateName('warringis');
        if(nextState.hasOwnProperty(warringisAttrName)){
            newFormState['warringis'] = nextState[errorsAttrName];
        }

        const successesAttrName = this.getAttributeStateName('successes');
        if(nextState.hasOwnProperty(successesAttrName)){
            newFormState['successes'] = nextState[errorsAttrName];
        }

        if(Object.keys(formState).length > 0){
            this._backendUpdate = true;
            this.formApi.setFormState(Object.assign({}, formState, newFormState));
            this._backendUpdate = false;
        }
    }


    @autobind
    validateErrors(values) {
        return this.fireEvent('validateErrors', values);
    }

    setError(field, errorMessage)
    {
        let errors = this.errors || {};
        errors[field] = errorMessage;
        this.errors = errors;
    }

    setWarning(field, warningMessage)
    {
        let warnings = this.warnings || {};
        warnings[field] = warningMessage;
        this.warnings = warnings;
    }

    setSuccess(field, successMessage)
    {
        let successes = this.successes || {};
        successes[field] = successMessage;
        this.successes = successes;
    }

    hasErrors() {
        return this.errors.length !== 0;
    }

    resetErrors(){
        this.errors = [];
    }

    getCommonError() {
        return (
            this.errors && this.errors.hasOwnProperty('')) ?
            this.errors[''] : null;
    }

    @autobind
    handleFormChange(formState, formApi){
        this.setAttributes({
            'values': formState.values,
            'errors': formState.errors,
            'warnings': formState.warnings,
            'successes': formState.successes,
        }).then(() => {
            if(!this._backendUpdate)
                this.change(formState);
        });
    }



    render() {
        const form = this
        return (
            <ReactForm
                ref="reactForm"
                validate={this.props.validate}
                onChange={this.handleFormChange}
                defaultValues={this.props.defaultValues}>
                {formApi => {
                    form.formApi = formApi;
                    return (
                        <form
                            className={this.props.className}
                            style={this.props.style}
                            onSubmit={form.handleFormSubmitEvent}>
                            {form.getCommonError() &&
                             <div className="alert alert-warning">
                                 {form.getCommonError()}
                             </div>
                            }
                            {this.props.children}
                        </form>
                    );
                }}
            </ReactForm>
        )
    }

}

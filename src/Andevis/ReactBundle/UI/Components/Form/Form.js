import React from 'react';
import {Component} from './../../ComponentBase';
import {Form as ReactForm} from 'react-form';
import {autobind} from 'core-decorators';
import PropTypes from 'prop-types';
import Loader from 'react-loader-advanced';
import './FormInputBase.scss';

export default class Form extends Component {

    static propTypes = Object.assign({}, Component.propTypes, {
        defaultValues: PropTypes.object,
        onFormUpdate: PropTypes.func,
    });

    static childContextTypes = Object.assign({}, Component.childContextTypes, {
        form: PropTypes.object,
    });

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

    getBundleName() {
        return 'React';
    }

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
        return super.eventList().concat(['submit', 'clean', 'validateErrors', 'reset']);
    }

    /**
     * Did mount event
     * @returns {Promise}
     */
    didMount() {
        return this.fireEvent('didMount');
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
        this.submit();
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

    resetAll() {
        this.formApi.resetAll()
    }

    // TODO: rename to setValues
    setAllValues(values) {
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


    prepareStateAfterEvent(nextState){
        // console.log("prepareStateAfterEvent", nextState);
        // Когда изменяется состояние (допустим после события на бэкенде)
        // устанавливаем значения для formApi
        if(this.formApi && nextState){

            let formState = this.formApi.getFormState();
            let formStateChanged = false;
            const attrValues = this.getAttributeStateName('values');
            const attrErrors = this.getAttributeStateName('errors');
            const attrWarnings = this.getAttributeStateName('warnings');
            const attrSuccesses = this.getAttributeStateName('successes');
            if (
                nextState.hasOwnProperty(attrValues) &&
                nextState[attrValues] !== formState.values
            ) {
                formState.values = nextState[attrValues];
                formStateChanged = true;
            }

            if(
                nextState.hasOwnProperty(attrErrors) &&
                nextState[attrErrors] !== formState.errors
            ) {
                formState.errors = nextState[attrErrors];
                formStateChanged = true;
            }

            if(
                nextState.hasOwnProperty(attrWarnings) &&
                nextState[attrWarnings] !== formState.warnings
            ) {
                formState.warnings = nextState[attrWarnings];
                formStateChanged = true;
            }

            if(
                nextState.hasOwnProperty(attrSuccesses) &&
                nextState[attrSuccesses] !== formState.successes
            ) {
                formState.successes = nextState[attrSuccesses];
                formStateChanged = true;
            }

            if(formStateChanged) this.formApi.setFormState(formState);

        }
        return nextState;
    }

    componentWillUpdate(nextProps, nextState) {
        let formState = this.formApi.getFormState();
         // console.log('componentWillUpdate', nextProps, nextState);
        if(nextProps.defaultValues !== this.props.defaultValues){

            formState.values = nextProps.defaultValues;
            this.values = nextProps.defaultValues;
            this.formApi.setFormState(formState);
        } else {
            const attrValues = this.getAttributeStateName('values');
            const nextStateValues = (nextState.hasOwnProperty(attrValues)) ? nextState[attrValues] : null;
            if(formState.values !== nextStateValues){
                nextState[attrValues] = formState.values;
            }
        }
    }


    @autobind
    validateErrors(values) {
        return this.fireEvent('validateErrors', values);
    }

    setError(field, errorMessage)
    {
        let errors = this.errors;
        errors[field] = errorMessage;
        this.errors = errors;
    }

    setWarning(field, warningMessage)
    {
        let warnings = this.warnings;
        warnings[field] = warningMessage;
        this.warnings = warnings;
    }

    setSuccess(field, successMessage)
    {
        let successes = this.successes;
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
            this.errors.hasOwnProperty('')) ?
            this.errors[''] : null;
    }

    @autobind
    handleFormDidUpdate(formState)
    {
        if(this.props.onFormUpdate) {
            this.props.onFormUpdate(formState);
        }
        const attrValues = this.getAttributeStateName('values');
        const attrErrors = this.getAttributeStateName('errors');
        const attrWarnings = this.getAttributeStateName('warnings');
        const attrSuccesses = this.getAttributeStateName('successes');
        let newState = {};
        newState[attrValues] = formState.values;
        newState[attrErrors] = formState.errors;
        newState[attrWarnings] = formState.warnings;
        newState[attrSuccesses] = formState.successes;
        this.setState(newState);
    }

    render() {
        const form = this
        return (
            <ReactForm
                ref="reactForm"
                dontValidateOnMount={true}
                formDidUpdate={form.handleFormDidUpdate}
                validateOnSubmit={true}
                defaultValues={this.props.defaultValues}
                >
                {formApi => {
                    form.formApi = formApi;
                    return (
                        <form
                            onSubmit={form.handleFormSubmitEvent}>
                            {form.getCommonError() &&
                             <div className="alert alert-warning">
                                 {form.getCommonError()}
                             </div>
                            }
                            {/*<Loader*/}
                                {/*show={form.isProcessing}*/}
                                {/*backgroundStyle={{backgroundColor: 'rgba (255, 255, 255, 0.8)'}}*/}
                                {/*message={null}>*/}
                            {this.props.children}
                            {/*</Loader>*/}
                        </form>
                    );
                }}
            </ReactForm>
        )
    }

}

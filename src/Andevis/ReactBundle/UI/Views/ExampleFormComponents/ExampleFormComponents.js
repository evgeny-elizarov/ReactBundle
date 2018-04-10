import React from 'react';
import ReactDOM from 'react-dom';

import { Text as TextTest, Field as ReacField } from 'react-form';
import { autobind } from 'core-decorators';
import {
    View,
    Form,
    Field,
    Button,
    DateTime,
    Text,
    TextArea,
    Select,
    RadioGroup,
    Radio,
    Checkbox,
    AutoComplete
} from "@AndevisReactBundle/UI/Components";
import classNames from "classnames";
import Container from "@AndevisReactBundle/UI/Components/Container/Container";


class LogContainer extends Container {

    getInitialState() {
        return {
            messages: []
        }
    }

    render() {
        const text = this.state.messages.join('\r\n');
        return (
            <pre>{text}</pre>
        )
    }

}


class ControlsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            required: true,
            enabled: true,
            readOnly: false
        }
    }

    setCommonAttributes(attrs) {
        this.setState(attrs);
    }

    componentWillReceiveProps(props) {
        this.setState(props);
    }

    render() {
        return (
            <div>
                <div className="form-group">
                    <label>Name</label>
                    <Text
                        name={this.props.name}
                        index={0}
                        field="name"
                        placeholder="Name"
                        required={this.state.required}
                        enabled={this.state.enabled}
                        readOnly={this.state.readOnly}
                        inputProps={
                            {
                                style: {
                                    color: 'red'
                                }
                            }
                        }
                        helpText="Example block-level help text here."/>
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <Text
                        name={this.props.name}
                        index={1}
                        field="email"
                        type="email"
                        required={this.state.required}
                        readOnly={this.state.readOnly}
                        enabled={this.state.enabled}
                        placeholder="Email"
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <Text
                        name={this.props.name}
                        index={2}
                        field="password"
                        required={this.state.required}
                        readOnly={this.state.readOnly}
                        enabled={this.state.enabled}
                        type="password"
                    />
                </div>
                <div className="form-group">
                    <label>Select</label>
                    <Select
                        name={this.props.name}
                        index={3}
                        field="select"
                        required={this.state.required}
                        readOnly={this.state.readOnly}
                        enabled={this.state.enabled}
                        selectProps={
                            {
                                style: {
                                    color: 'red'
                                }
                            }
                        }
                        options={[
                            { value: '', text: '-- Select char --' },
                            { value: 'a', text: 'A' },
                            { value: 'b', text: 'B' },
                            { value: 'c', text: 'C' },
                        ]}
                    />
                </div>

                <div className="form-group">
                    <label>Auto complete</label>
                    <AutoComplete
                        name={this.props.name}
                        index={4}
                        field="autoComplete1"
                        dataSource={[
                            'A', 'B', 'C'
                        ]}
                        required={this.state.required}
                        readOnly={this.state.readOnly}
                        enabled={this.state.enabled}
                        placeholder="Type your search request"
                        helpText="Type part of example text above"/>
                </div>

                <div className="form-group">
                    <label>Auto complete (custom data)</label>
                    <AutoComplete
                        name={this.props.name}
                        index={5}
                        field="autoComplete2"
                        dataSource={[
                            { id: 'a', value: 'A' },
                            { id: 'b', value: 'B' },
                            { id: 'c', value: 'C' },
                        ]}
                        dataFields={{
                            value: 'id',
                            text: 'value'
                        }}
                        required={this.state.required}
                        readOnly={this.state.readOnly}
                        enabled={this.state.enabled}
                        placeholder="Type your search request"
                        helpText="Type part of example text above"/>
                </div>

                <div className="form-group">
                    <label>Auto complete server data</label>
                    <AutoComplete
                        name={this.props.name}
                        index={6}
                        field="backendAutocomplete"
                        minLength={1}
                        dataFields={{
                            value: 'name'
                        }}
                        required={this.state.required}
                        readOnly={this.state.readOnly}
                        enabled={this.state.enabled}
                        placeholder="Type your search request"
                        helpText="Type part of example text above"/>
                </div>
                <div className="form-group">
                    <label>Color</label>
                    <Text
                        field="color"
                        name={this.props.name}
                        index={7}
                        required={this.state.required}
                        readOnly={this.state.readOnly}
                        enabled={this.state.enabled}
                        type="color"
                    />
                </div>

                <div className="form-group">
                    <label>Date</label>
                    <DateTime
                        field="date"
                        name={this.props.name}
                        index={8}
                        timeFormat={false}
                        required={this.state.required}
                        readOnly={this.state.readOnly}
                        enabled={this.state.enabled}
                    />
                </div>
                <div className="form-group">
                    <label>Date time</label>
                    <DateTime
                        field="dateTime"
                        name={this.props.name}
                        index={9}
                        required={this.state.required}
                        readOnly={this.state.readOnly}
                        enabled={this.state.enabled}
                    />
                </div>
                <div className="form-group">
                    <label>Time</label>
                    <DateTime
                        field="time"
                        name={this.props.name}
                        index={10}
                        dateFormat={false}
                        required={this.state.required}
                        readOnly={this.state.readOnly}
                        enabled={this.state.enabled}
                    />
                </div>
                {/* TODO: Сделать компонент контролируемым */}
                {/*<RadioGroup field="gender">*/}
                {/*<div className="radio">*/}
                {/*<label htmlFor="male" className="mr-2">*/}
                {/*<Radio*/}
                {/*value="male"*/}
                {/*id="male"*/}
                {/*className="mr-3 d-inline-block"*/}
                {/*/>*/}
                {/*Male*/}
                {/*</label>*/}
                {/*<label htmlFor="female" className="mr-2">*/}
                {/*<Radio*/}
                {/*value="female"*/}
                {/*id="female"*/}
                {/*className="d-inline-block"*/}
                {/*/>*/}
                {/*Female*/}
                {/*</label>*/}
                {/*</div>*/}
                {/*</RadioGroup>*/}
                <div className="checkbox">
                    <label>
                        <Checkbox
                            field="checkbox"
                            name={this.props.name}
                            index={11}
                            required={this.state.required}
                            readOnly={this.state.readOnly}
                            enabled={this.state.enabled}
                        />
                        Checkbox
                    </label>
                </div>

                <div className="form-group">
                    <label>Big text</label>
                    <TextArea
                        name={this.props.name}
                        index={12}
                        field="bit_text"
                        required={this.state.required}
                        readOnly={this.state.readOnly}
                        enabled={this.state.enabled}
                    />
                </div>
            </div>
        )
    }
}

export default class ExampleFormComponents extends View {


    constructor(props, context) {
        super(props, context);
        this.state = {
            ctrlStateRequired: true,
            ctrlStateEnabled: true,
            ctrlStateReadOnly: false
        };
    }

    getBundleName() {
        return 'React';
    }

    /**
     *  Logger to view debug info
     */
    @autobind
    log(message, callback) {
        const debugLog = this.getComponentByName('debugLog');
        let messages = debugLog.state.messages.slice(0, 24);
        messages.unshift("Frontend:\t" + message);
        debugLog.setState({ messages: messages }, callback);
    }

    //
    // Log controls events:
    //

    ExampleForm_onDidMount() {
        this.log('ExampleForm_onDidMount');
    }

    formCtrl_onClick(ctrl) {
        this.log(ctrl.getName() + "(" + ctrl.getIndex() + ") : clicked");
    }

    formCtrl_onDoubleClick(ctrl) {
        this.log(ctrl.getName() + "(" + ctrl.getIndex() + ") : double clicked");
    }

    formCtrl_onInput(ctrl, value) {
        this.log(ctrl.getName() + "(" + ctrl.getIndex() + ") : input : " + value);
    }

    formCtrl_onChange(ctrl, value) {
        this.log(ctrl.getName() + "(" + ctrl.getIndex() + ") : change : " + value);
    }

    outCtrl_onClick(ctrl) {
        this.log(ctrl.getName() + "(" + ctrl.getIndex() + ") : clicked");
    }

    outCtrl_onDoubleClick(ctrl) {
        this.log(ctrl.getName() + "(" + ctrl.getIndex() + ") : double clicked");
    }

    outCtrl_onInput(ctrl, value) {
        this.log(ctrl.getName() + "(" + ctrl.getIndex() + ") : input : " + value);

        this.updateOutCtrlValueState();
    }

    outCtrl_onChange(ctrl, value) {
        this.log(ctrl.getName() + "(" + ctrl.getIndex() + ") : change : " + value);

        this.updateOutCtrlValueState();
    }


    updateOutCtrlValueState(){
        let values = {}
        this.getComponentByName('outCtrl').forEach((ctrl) => {
            values[ctrl.props.field] = ctrl.getValue();
        });
        this.getComponentByName('outControlState').setState({
            values: values
        });
    }

    //
    // Test actions:
    //
    getTestButtons() {
        return [
            {
                name: 'btnSubmitForm',
                title: 'Submit form',
                onClick: () => {
                    this.getComponentByName('frmExample').submit();
                }
            },
            {
                name: 'btnResetForm',
                title: 'Reset form',
                onClick: () => {
                    this.getComponentByName('frmExample').resetAll();
                }
            },
            {
                name: 'btnClearCtrl',
                title: 'Clear out controls',
                onClick: () => {
                    this.getComponentByName('formCtrl').forEach((ctrl) => {
                        ctrl.value = null;
                    });
                    this.getComponentByName('outCtrl').forEach((ctrl) => {
                        ctrl.value = null;
                    });
                    this.updateOutCtrlValueState();
                }
            },
            {
                name: 'btnSetValidationErrorsOnClient',
                title: 'Set validation errors on client',
                onClick: () => {
                    this.getComponentByName('frmExample').setError('name', 'Error');
                }
            },
            {
                name: 'btnSetValidationErrorsOnServer',
                title: 'Set validation errors on server',
            },
            {
                name: 'btnLoadValuesFromServer',
                title: 'Load values from server'
            },
            {
                name: 'btnSetValuesOnClient',
                title: 'Set values on client',
                onClick: () => {
                    this.getComponentByName('formCtrl').forEach((ctrl) => {
                        ctrl.value = 'a';
                    });
                    this.getComponentByName('outCtrl').forEach((ctrl) => {
                        ctrl.value = 'a';
                    });
                    this.updateOutCtrlValueState();
                }
            },
            {
                name: 'btnSwitchEnabled',
                title: 'enabled: ' + this.state.ctrlStateEnabled.toString(),
                onClick: () => {
                    this.setState({ ctrlStateEnabled: !this.state.ctrlStateEnabled });
                }
            },
            {
                name: 'btnSwitchReadOnly',
                title: 'readOnly: ' + this.state.ctrlStateReadOnly.toString(),
                onClick: () => {
                    this.setState({ ctrlStateReadOnly: !this.state.ctrlStateReadOnly })
                }
            },
            {
                name: 'btnSwitchRequired',
                title: 'required: ' + this.state.ctrlStateRequired.toString(),
                onClick: () => {
                    this.setState({ ctrlStateRequired: !this.state.ctrlStateRequired })
                }
            },
            {
                name: 'btnSwitchIsChecked',
                title: 'Switch is checked',
                onClick: () => {
                    this.getComponentByName('formCtrl').forEach((ctrl) => {
                        if(ctrl.constructor.name === 'Checkbox')
                        {
                            ctrl.isChecked(!ctrl.isChecked());
                        }
                    });
                    this.getComponentByName('outCtrl').forEach((ctrl) => {
                        if(ctrl.constructor.name === 'Checkbox')
                        {
                            ctrl.isChecked(!ctrl.isChecked());
                        }
                    });
                }
            },
            {
                name: 'btnClearDebugLog',
                title: 'Clear debug log',
                onClick: () => {
                    this.getComponentByName('debugLog').setState({ messages: [] });
                }
            }
        ];
    }


    /**
     * Form state
     * @param form
     * @param formState
     */
    frmExample_onChange(form, formState) {
        this.getComponentByName('formState').setState({
            values: formState.values
        });
    }

    /**
     * Set form values to views state on form submit
     */
    frmExample_onSubmit(form, values) {
        this.log('frmExample_onSubmit ' + JSON.stringify(values));
    }

    /**
     *  After load data from server
     */
    btnLoadValuesFromServer_afterClick(){
        this.updateOutCtrlValueState();
    }

    handleFormChange(frmExample, formState){
        this.getComponentByName('formState').setState({
            values: Object.assign({}, formState.values)
        });
    }

    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Form components example</h1>
                </div>

                <div className="row">

                    {/* Controls inside form */}
                    <div className="col-md-3">
                        <h3>Controls inside form</h3>
                        <Form name="frmExample" onChange={this.handleFormChange}>
                            <ControlsList
                                name="formCtrl"
                                required={this.state.ctrlStateRequired}
                                enabled={this.state.ctrlStateEnabled}
                                readOnly={this.state.ctrlStateReadOnly}
                            />
                            <Button
                                name="btnSubmit"
                                type="submit"
                                title="Test simple submit button"
                                className="btn-success"/>
                            <Button
                                name="btnReset"
                                type="reset"
                                title="Test simple reset button"/>
                        </Form>
                    </div>

                    {/* Controls outside form */}
                    <div className="col-md-3">
                        <h3>Controls outside form</h3>
                        <ControlsList
                            name="outCtrl"
                            required={this.state.ctrlStateRequired}
                            enabled={this.state.ctrlStateEnabled}
                            readOnly={this.state.ctrlStateReadOnly}
                        />
                    </div>

                    {/* Test buttons */}
                    <div className="col-md-2">
                        <h3>Tests</h3>
                        <div className="form-group">
                            {this.getTestButtons().map((test, i) => (
                                <Button key={i} className="btn-success" {...test} />
                            ))}
                        </div>
                    </div>

                    {/* Debug info */}
                    <div className="col-md-4">
                        <fieldset>
                            <legend>Debug log:</legend>
                            <LogContainer name="debugLog"/>
                        </fieldset>
                        <fieldset>
                            <legend>Form values:</legend>
                            <Container name="formState" content={(props, state) => (
                                <pre>{state.values && JSON.stringify(state.values, null, 4)}</pre>
                            )}/>
                        </fieldset>
                        <fieldset>
                            <legend>Out controls values:</legend>
                            <Container name="outControlState" content={(props, state) => (
                                <pre>{state.values && JSON.stringify(state.values, null, 4)}</pre>
                            )}/>
                        </fieldset>

                    </div>
                </div>

            </div>
        );

    }
}

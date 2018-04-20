import React from 'react';
import { autobind } from 'core-decorators';
import {
    Form,
    Button,
} from "@AndevisReactBundle/UI/Components";
import Container from "@AndevisReactBundle/UI/Components/Container/Container";
import ExampleBaseView from "@AndevisReactBundle/UI/Views/ExampleBaseView";
import LogContainer from "@AndevisReactBundle/UI/Views/LogContainer";
import ControlsList from './ControlsList';


export default class ExampleFormComponents extends ExampleBaseView {

    static bundleName = 'React';

    constructor(props, context) {
        super(props, context);
        this.state = {
            ctrlStateRequired: true,
            ctrlStateEnabled: true,
            ctrlStateReadOnly: false
        };
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

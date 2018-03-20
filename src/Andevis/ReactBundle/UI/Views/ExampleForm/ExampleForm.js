import React from 'react';
import { autobind } from 'core-decorators';
import {
    View,
    Form,
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

export default class ExampleForm extends View {


    constructor(props, context) {
        super(props, context);
        this.state = {
            eventLog: '',
            autoCompleteText: '',
            frontendFormValues: {},
            backendFormValues: {}
        };
    }

    getBundleName(){
        return 'React';
    }

    /**
     *  Logger to view debug info
     */
    @autobind
    log(message, callback) {
        this.setState({ eventLog: this.state.eventLog + "Frontend:\t" + message + '\r\n' }, callback);
    }

    /**
     * View event when component mount on page
     */
    ExampleForm_onDidMount() {
        this.log('ExampleForm_onDidMount');
    }

    /**
     * Click event handler for Text:txtName component triggered when clicked
     */
    txtName_onClick(txt) {
        this.log('txtName_onClick');
    }

    btnSubmitExample2_onClick(btn)
    {
        return this.getComponentByName('frmExample').submit();
    }

    /**
     * Set form values to views state on form submit
     */
    frmExample_onSubmit(form, values) {
        this.log('frmExample_onSubmit '+JSON.stringify(values));
        this.setState({
            frontendFormValues: values
        });
    }

    /**
     * On click clear debug log
     */
    btnClearLog_onClick(){
        this.setState({ eventLog: '' });
    }

    // selMyAutoComplete_onFetchOptions(autocomplete, query){
    //     console.log("selMyAutoComplete_onFetchOptions", query);
    //     return [
    //         {text: 'aaa', value:1},
    //         {text: 'bbb', value:2},
    //         {text: 'ccc', value:3},
    //         {text: 'ddd', value:4},
    //         {text: 'eee', value:5},
    //         {text: 'fff', value:6},
    //         {text: 'ggg', value:7},
    //     ];
    // }

    selMyAutoComplete_onSelectOption(autocomplete, option){
        console.log("selMyAutoComplete_onSelectOption", option);
    }

    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Form example</h1>
                </div>
                <Form name="frmExample">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Name</label>
                                <Text
                                    field="name"
                                    name="txtName"
                                    placeholder="Name"
                                    required={true}
                                    helpText="Example block-level help text here."/>
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <Text field="email" type="email" name="txtEmail" placeholder="Email"/>
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <Text field="password" type="password" name="txtPassword"/>
                            </div>
                            <div className="form-group">
                                <label>Select</label>
                                <Select name="selManual" field="choiceManual" />
                            </div>
                            <div className="form-group">
                                Autcomplete search source
                                <pre>
                                    {this.state.autoCompleteText}
                                </pre>
                            </div>
                            <div className="form-group">
                                <label>Auto complete</label>
                                <AutoComplete
                                    field="autoComplete1"
                                    name="selMyAutoComplete"
                                    index={0}
                                    placeholder="Type your search request"
                                    helpText="Type part of example text above"/>
                            </div>
                            <div className="form-group">
                                <label>Auto complete (fetch on enter)</label>
                                <AutoComplete
                                    field="autoComplete2"
                                    name="selMyAutoComplete"
                                    index={1}
                                    fetchOnEnter={true}
                                    placeholder="Type your search request"
                                    helpText="Type part of example text above"/>
                            </div>
                            <div className="form-group">
                                <label>Auto complete (cutstom render)</label>
                                <AutoComplete
                                    field="autoComplete2"
                                    name="selMyAutoComplete"
                                    index={3}
                                    placeholder="Type your search request"
                                    helpText="Type part of example text above"
                                    renderItem={
                                        (item, isHighlighted) => (
                                            <span key={item.value} style={{padding: '3px'}}>{ isHighlighted ? (<b>{item.text}</b>) : (item.text)}</span>
                                        )
                                    }
                                />
                            </div>


                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Color</label>
                                <Text field="color" type="color" name="txtColor"/>
                            </div>

                            <div className="form-group">
                                <label>Date</label>
                                <DateTime field="date" timeFormat={false} />
                            </div>

                            <div className="form-group">
                                <label>Date time</label>
                                <DateTime field="dateTime" />
                            </div>

                            <div className="form-group">
                                <label>Time</label>
                                <DateTime field="time" dateFormat={false} />
                            </div>

                            <RadioGroup field="gender">
                                {group => (
                                    <div className="radio">
                                        <label htmlFor="male" className="mr-2">
                                            <Radio
                                                group={group}
                                                value="male"
                                                id="male"
                                                className="mr-3 d-inline-block"/>
                                            Male
                                        </label><br/>
                                        <label htmlFor="female" className="mr-2">
                                            <Radio
                                                group={group}
                                                value="female"
                                                id="female"
                                                className="d-inline-block"/>
                                            Female
                                        </label>
                                    </div>
                                )}
                            </RadioGroup>

                            <div className="checkbox">
                                <label>
                                    <Checkbox field="checkbox" className="d-inline-block"/>
                                    Checkbox
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Big text</label>
                                <TextArea field="bit_text" name="txtBigText"/>
                            </div>

                            <br/>
                            <div className="form-group">
                                <Button
                                    name="btnSubmitExample"
                                    type="submit"
                                    title="Submit"
                                    className="btn-success"/>

                                <Button
                                    name="btnSubmitExample2"
                                    title="Submit by click"
                                    className="btn-success"/>

                                <Button name="btnClearLog" title="Clear log" className="btn-default"/>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <fieldset>
                                <legend>Frontend submitted values:</legend>
                                <pre>
                                    {JSON.stringify(this.state.frontendFormValues, null, 4)}
                                </pre>
                            </fieldset>
                            <fieldset>
                                <legend>Backend submitted values:</legend>
                                <pre>
                                    {JSON.stringify(this.state.backendFormValues, null, 4)}
                                </pre>
                            </fieldset>
                            <fieldset>
                                <legend>Debug log:</legend>
                                <pre>
                                    {this.state.eventLog}
                                </pre>
                            </fieldset>
                        </div>
                    </div>
                </Form>
            </div>
        );

    }
}

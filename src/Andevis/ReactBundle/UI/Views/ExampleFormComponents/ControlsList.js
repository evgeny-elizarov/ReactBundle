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



export default class ControlsList extends React.Component {

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
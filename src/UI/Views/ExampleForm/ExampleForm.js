import React from "@AndevisReactBundle/react";
import View from "@AndevisReactBundle/UI/Components/View/View";
import Form from "@AndevisReactBundle/UI/Components/Form/Form";
import Text from "@AndevisReactBundle/UI/Components/Form/Fields/Text/Text";
import Button from "@AndevisReactBundle/UI/Components/Button/Button";
import ExampleBaseView from "@AndevisReactBundle/UI/Views/ExampleBaseView";
import Select from "@AndevisReactBundle/UI/Components/Form/Fields/Select/Select";

export default class ExampleForm extends ExampleBaseView {

    static bundleName = 'React';

    getInitialState(){
        return {
            testBuffer: {}
        }
    }

    render(){
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Form example</h1>
                </div>
                <Form name="formExample" defaultValues={{
                    test: 'aaa'
                }}>
                    <Select field="testSelect" options={[
                        { value: '', text: 'Default'},
                        { value: 'Y', text: 'Yes'},
                        { value: 'N', text: 'No'},
                    ]}/>
                    <Text field="testText" />
                    <Button type="submit" />
                </Form>
                <pre>
                    {JSON.stringify(this.state.testBuffer)}
                </pre>
            </div>
        )
    }
}
import React from 'react';
import View from "@AndevisReactBundle/UI/Components/View/View";
import Container from "@AndevisReactBundle/UI/Components/Container/Container";
import Button from "@AndevisReactBundle/UI/Components/Button/Button";
import ExampleBaseView from "@AndevisReactBundle/UI/Views/ExampleBaseView";

export default class ExampleContainer extends ExampleBaseView {

    static bundleName = 'React';

    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Container component</h1>
                </div>
                <div className="row">
                    <Container
                        name="sampleContainer"
                        content={(state) => (
                            <div>
                                {JSON.stringify(state)}
                            </div>
                        )}
                    />
                    <Button name="btnTest" />
                </div>
            </div>
        );

    }
}
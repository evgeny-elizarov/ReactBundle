import React from 'react';
import View from "@AndevisReactBundle/UI/Components/View/View";
import Container from "@AndevisReactBundle/UI/Components/Container/Container";
import Button from "@AndevisReactBundle/UI/Components/Button/Button";

export default class ExampleContainer extends View {

    getBundleName(){
        return 'React';
    }

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
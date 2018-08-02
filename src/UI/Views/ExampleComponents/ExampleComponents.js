import React from 'react';
import ExampleComponent from "@AndevisReactBundle/UI/Components/ExampleComponent/ExampleComponent";
import ExampleBaseView from "@AndevisReactBundle/UI/Views/ExampleBaseView";

export default class ExampleComponents extends ExampleBaseView {

    static bundleName = 'React';

    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Custom component example</h1>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <h2>Component one</h2>
                        <ExampleComponent/>
                    </div>
                    <div className="col-md-6">
                        <h2>Component two</h2>
                        <ExampleComponent/>
                    </div>
                </div>
            </div>
        );

    }
}

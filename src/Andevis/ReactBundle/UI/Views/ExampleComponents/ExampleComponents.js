import React from 'react';
import View from "@AndevisReactBundle/UI/Components/View/View";
import ExampleComponent from "@AndevisReactBundle/UI/Components/ExampleComponent/ExampleComponent";

export default class ExampleComponents extends View {

    getBundleName(){
        return 'React';
    }

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

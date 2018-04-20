import React from "@AndevisReactBundle/react";
import Button from "@AndevisReactBundle/UI/Components/Button/Button";
import ExampleBaseView from "@AndevisReactBundle/UI/Views/ExampleBaseView";

export default class NestedView extends ExampleBaseView {

    static bundleName = 'React';


    render(){
        return (
            <div style={{border: '1px solid red'}}>
                Nested view
                <Button name={"btnTest"} />
            </div>
        )
    }
}
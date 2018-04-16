import React from 'react';
import Button from "@AndevisReactBundle/UI/Components/Button/Button";
import ExampleBaseView from "@AndevisReactBundle/UI/Views/ExampleBaseView";

export default class TestView1 extends ExampleBaseView {

    getBundleName(){
        return 'React';
    }

    render(){
        return (
            <div className="container" style={{ border: '1px solid green'}}>
                Test view 1:
                <Button
                    onClick={() => {
                        this.setGlobalState({
                            counter: (this.globalState.counter || 0) + 1
                        })
                    }}
                />
            </div>
        )
    }
}
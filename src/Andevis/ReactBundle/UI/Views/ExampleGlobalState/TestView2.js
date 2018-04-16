import React from 'react';
import ExampleBaseView from "@AndevisReactBundle/UI/Views/ExampleBaseView";

export default class TestView1 extends ExampleBaseView {

    getBundleName(){
        return 'React';
    }

    /**
     * При монтировании вьшки инициализируе наблюдаемые переменные глобального состояния
     * @return {{counter: number}}
     */
    getInitialGlobalState(){
        return { counter: 0 }
    }

    render(){
        return (
            <div className="container" style={{ border: '1px solid red'}}>
                Test view 2:
                <p>Global counter value: {this.globalState.counter }</p>

            </div>
        )
    }
}
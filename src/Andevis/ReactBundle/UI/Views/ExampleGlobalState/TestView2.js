import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import View from "@AndevisReactBundle/UI/Components/View/View";



export default class TestView1 extends View {

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
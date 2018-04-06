import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import View from "@AndevisReactBundle/UI/Components/View/View";
import Button from "@AndevisReactBundle/UI/Components/Button/Button";


export default class TestView1 extends View {

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
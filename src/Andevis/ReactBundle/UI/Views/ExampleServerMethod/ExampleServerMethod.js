import React from 'react';
import ReactDOMServer from 'react-dom/server';
import View from "@AndevisReactBundle/UI/Components/View/View";
import Button from "@AndevisReactBundle/UI/Components/Button/Button";
import MsgBox from "@AndevisReactBundle/UI/Components/MsgBox";


export default class ExampleServerMethod extends View {

    getBundleName(){
        return 'React';
    }

    getInitialState(){
        return {
            serverResult: null
        }
    }

    btnCallServerMethod_onClick(){
        this
            .callServerMethod('serverMethod', 1, 2)
            .then((result) => {
                this.setState({ serverResult: result })
            });
    }

    btnClearResult_onClick(){
        this.setState({serverResult: null});
    }

    render(){
        return (
            <div>
                Server method result: {this.state.serverResult}
                <Button name="btnCallServerMethod" title="Call server method" />
                <Button name="btnClearResult" title="Clear result" />
            </div>
        )
    }
}
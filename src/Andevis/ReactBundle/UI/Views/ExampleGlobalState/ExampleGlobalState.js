import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import View from "@AndevisReactBundle/UI/Components/View/View";
import TestView1 from "./TestView1";
import TestView2 from "./TestView2";



export default class ExampleGlobalState extends View {

    getBundleName(){
        return 'React';
    }

    render(){
        return (
            <div className="container">
                <TestView1 />
                <TestView2 />
            </div>
        )
    }
}
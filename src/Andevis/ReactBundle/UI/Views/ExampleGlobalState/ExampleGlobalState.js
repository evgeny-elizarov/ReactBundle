import React from 'react';
import TestView1 from "./TestView1";
import TestView2 from "./TestView2";
import ExampleBaseView from "@AndevisReactBundle/UI/Views/ExampleBaseView";



export default class ExampleGlobalState extends ExampleBaseView {

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
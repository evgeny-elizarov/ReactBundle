import React from "@AndevisReactBundle/react";
import PropTypes from "@AndevisReactBundle/prop-types";
import ExampleBaseView from "@AndevisReactBundle/UI/Views/ExampleBaseView";
import SubscriberView from "@AndevisReactBundle/UI/Views/ExampleEvents/SubscriberView";
import Button from "@AndevisReactBundle/UI/Components/Button/Button";
import NestedView from "@AndevisReactBundle/UI/Views/ExampleEvents/NestedView";

export default class ExampleEvents extends ExampleBaseView {

    static bundleName = 'React';

    static childContextTypes = Object.assign({}, ExampleBaseView.childContextTypes, {
        exampleParentView: PropTypes.object.isRequired,
    });

    getChildContext(){
        return Object.assign(super.getChildContext(), {
            exampleParentView: this
        });
    }

    btnFocus_onClick(){
        this.focus();
    }

    btnBlur_onClick(){
        this.blur();
    }

    render(){
        return (
            <div className="container" style={{border: this.hasFocus ? '1px solid red' : '1px solid blue'}}>
                <div className="page-header">
                    <h1>Events example</h1>
                </div>
                <div>
                    <Button name="btnFocus" title={"Focus me"}/>
                    <Button name="btnBlur" title={"Blur me"}/>
                </div>
                <div className="row">
                    <div className="col-md-6"><SubscriberView /></div>
                    <div className="col-md-6"><NestedView /></div>
                </div>
            </div>
        )
    }
}
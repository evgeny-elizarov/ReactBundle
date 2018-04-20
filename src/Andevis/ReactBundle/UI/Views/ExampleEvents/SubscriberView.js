import React from "@AndevisReactBundle/react";
import PropTypes from "@AndevisReactBundle/prop-types";
import ExampleBaseView from "@AndevisReactBundle/UI/Views/ExampleBaseView";
import { autobind } from 'core-decorators';

export default class SubscriberView extends ExampleBaseView {

    static bundleName = 'React';

    static contextTypes = Object.assign({}, ExampleBaseView.contextTypes, {
        exampleParentView: PropTypes.object,
    });

    getInitialState(){
        return {
            logBuffer: ''
        }
    }

    @autobind
    clickEventSubscriber(component){
        this.setState({
            logBuffer: "Click on component " + component.getName() + "\r\n" + this.state.logBuffer
        });
    }

    @autobind
    parentViewFocusListener(component){
        this.setState({
            logBuffer: "Parent view got focus " + component.getName() + "\r\n" + this.state.logBuffer
        });
    }

    SubscriberView_onDidMount(){
        // Subscribe on click event
        this.subscribeOnEvent('click', this.clickEventSubscriber);

        // Add event listener to parent view trought context
        this.context.exampleParentView.addEventListener('focus', this.parentViewFocusListener);
    }


    render(){
        return (
            <div style={{border: '1px solid green'}}>
                Subscriber view
                <pre>{this.state.logBuffer}</pre>
            </div>
        )
    }
}

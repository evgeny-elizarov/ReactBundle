import React from "@AndevisReactBundle/react";
import Container from "@AndevisReactBundle/UI/Components/Container/Container";

export default class LogContainer extends Container {

    getInitialState() {
        return {
            messages: []
        }
    }

    render() {
        const text = this.state.messages.join('\r\n');
        return (
            <pre>{text}</pre>
        )
    }

}
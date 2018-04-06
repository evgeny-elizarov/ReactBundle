import React from 'react';
import { autobind } from 'core-decorators';

class state {

    constructor() {
        this.state = {};
        this.willUpdateSubscriptions = [];
        this.didUpdateSubscriptions = [];
    }

    /**
     * Subscribe will update handler
     * @param handler
     * @return {number}
     */
    subscribeWillUpdate(handler) {
        this.willUpdateSubscriptions.push(handler);
        return this.willUpdateSubscriptions.lastIndexOf(handler);
    }

    /**
     * Subscribe did update handler
     * @param handler
     * @return {number}
     */
    subscribeDidUpdate(handler) {
        this.didUpdateSubscriptions.push(handler);
        return this.didUpdateSubscriptions.lastIndexOf(handler);
    }

    /**
     * Unsubscribe will update handler
     * @param handle
     */
    unsubscribeWillUpdate(handleSubsIndex) {
        delete this.willUpdateSubscriptions[handleSubsIndex];
    }

    /**
     * Unsubscribe did update handler
     * @param handle
     */
    unsubscribeDidUpdate(handleSubsIndex) {
        delete this.didUpdateSubscriptions[handleSubsIndex];
    }

    /**
     * Set state
     * @param obj
     */
    @autobind
    setState(obj) {

        // Call will update subscriptions
        this.willUpdateSubscriptions.forEach((handler) => {
            if(typeof handler === 'function') {
                handler(obj);
            }
        });

        // Update state
        const prevState = Object.assign({}, this.state);
        this.state = Object.assign({}, this.state, obj);

        // Call did updatae subscriptions
        this.didUpdateSubscriptions.forEach((handler) => {
            if(handler) {
                handler(prevState);
            }
        })
    }
}

const globState = new state();


export default globState;
export {
    globState
};

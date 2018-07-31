import Listeners from 'listeners';

class EventSubscribers {

    constructor() {
        this.eventListeners = {};
    }

    /**
     * Subscribe listener
     * @param eventName
     * @param callback
     * @param context
     */
    subscribe(eventName, callback, context){
        if(!this.eventListeners.hasOwnProperty(eventName)) {
            this.eventListeners[eventName] = new Listeners((e) => {
                console.log("Catch listener error", e);
                // stop call other listeners
                return false;
            });
        }
        this.eventListeners[eventName].add(callback, context);
    }

    /**
     * Unsubscribe listener
     * @param eventName
     * @param callback
     * @param context
     */
    unsubscribeComponent(eventName, callback, context){
        Object.keys(this.eventListeners).forEach((eventName) => {
            this.eventListeners[eventName].remove(callback, context);
        });
    }

    /**
     * Unsubscribe all event listener
     */
    unsubscribeAll(){
        Object.keys(this.eventListeners).forEach((eventName) => {
            this.eventListeners[eventName].clear();
            delete this.eventListeners[eventName];
        });
    }

    /**
     * Fire event
     * @param eventName
     * @param args
     */
    fireEventArray(eventName, args){
        if(this.eventListeners.hasOwnProperty(eventName)){
            this.eventListeners[eventName].fireArray(args);
        }
    }
}

const eventSubscribers = new EventSubscribers();

export default eventSubscribers;
export {
    eventSubscribers
}

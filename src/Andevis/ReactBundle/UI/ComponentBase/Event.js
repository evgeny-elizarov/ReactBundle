// TODO: not used
class Event {

    constructor(component, eventName){
        this.name = eventName;
        this.component = component;
        this.isFrontendCompleted = false;
        this.isBackendCompleted = false;
        this.preventBackendCall = false;
        this.onSuccessCallbackStack = [];
        this.onErrorCallbackStack = [];
        this.preventDefault = false;
    }

    /**
     * Add user complete callback
     */
    onSuccess(userCallback){
        if(typeof userCallback !== 'function')
            throw new Error('Event user callback must be a function!');
        this.onSuccessCallbackStack.push(userCallback);
    }

    onError(userCallback){
        if(typeof userCallback !== 'function')
            throw new Error('Event user callback must be a function!');
        this.onErrorCallbackStack.push(userCallback);
    }

    preventBackend(){
        this.preventBackendCall = true;
    }

    frontendCompleted(){
        this.isFrontendCompleted = true;
    }

    backendCompleted(){
        this.isBackendCompleted = true;
    }

    preventDefault(){
        this.preventDefault = true;
    }

    runSuccessCallbacks(){
        if(this.onSuccessCallbackStack){
            for (let i in this.onSuccessCallbackStack){
                if(this.onSuccessCallbackStack.hasOwnProperty(i)){
                    const callback = this.onSuccessCallbackStack[i];
                    try{
                        callback(this);
                    } catch (error){
                        this.runErrorCallbacks(error);
                        break;
                    }

                    if(this.preventDefault){
                        break;
                    }
                }
            }
        }
    }

    runErrorCallbacks(error){
        if(this.onErrorCallbackStack){
            for (let i in this.onErrorCallbackStack){
                if(this.onErrorCallbackStack.hasOwnProperty(i)){
                    const callback = this.onErrorCallbackStack[i];
                    try{
                        callback(this, error);
                    } catch (error2){
                        console.error(error2.getMessage());
                        break;
                    }
                    if(this.preventDefault){
                        break;
                    }
                }
            }
        }
    }

    eventCompleted(){
        this.runSuccessCallbacks();
    }
}

export default Event;

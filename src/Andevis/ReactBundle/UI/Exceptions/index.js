/**
 * Base exception
 */
class Exception {

    constructor(message, cause = null){
        this.message = message;
        this.cause = cause;
        this.name = this.getExceptionName();
        if(cause instanceof Error)
            this.stack = cause.stack;
    }

    getExceptionName(){
        let className = this.constructor.name;
        if (className !== 'Exception' && className.substr(-9) === 'Exception') {
            className = className.substr(0, className.length - 9);
        }
        return className;
    }
}

/**
 * UI Exceptions
 */
class ComponentNotFoundException extends Exception {}

export {
    Exception,
    ComponentNotFoundException
}

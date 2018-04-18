/**
 * Apollo client subscribe service
 */
class ClientSubscribeService {

    constructor() {
        this.subscriptionsAfterware = [];
        this.subscriptionsMiddleware = [];
        this.subscriptionsError = [];
    }

    registerMiddleware(handler){
        this.subscriptionsMiddleware.push(handler);
        return this.subscriptionsMiddleware.lastIndexOf(handler);
    }

    unregisterMiddleware(subsIndex){
        delete this.subscriptionsMiddleware[subsIndex];
    }

    registerAfterware(handler){
        this.subscriptionsAfterware.push(handler);
        return this.subscriptionsAfterware.lastIndexOf(handler);
    }

    unregisterAfterware(subsIndex){
        delete this.subscriptionsAfterware[subsIndex];
    }

    registerErrorHandler(handler){
        this.subscriptionsError.push(handler);
        return this.subscriptionsError.lastIndexOf(handler);
    }

    unregisterErrorHandler(subsIndex){
        delete this.subscriptionsError[subsIndex];
    }

    /**
     * Execute middleware and afterware subscribers
     * @param operation
     * @param forward
     * @return {*}
     */
    executeMiddlewareHandlers(operation, forward)
    {
        // Call middleware subscribers
        if(this.subscriptionsMiddleware.length > 0)
        {
            this.subscriptionsMiddleware.forEach((handler) => {
                handler(operation);
            });
        }

        // Ger operation subscriber
        const result = forward(operation);

        // Subscribe afterware
        result.subscribe((response) => {
            if(this.subscriptionsAfterware.length > 0){
                this.subscriptionsAfterware.forEach((handler) => {
                    handler(response);
                });
            }
        });
        return result;
    }

    /**
     * Execute error handlers
     * @param options
     */
    executeErrorHandlers(options){
        if(this.subscriptionsError.length > 0){
            this.subscriptionsError.forEach((handler) => {
                handler(options);
            });
        }
    }
}


const clientSubscribeService = new ClientSubscribeService();

export default clientSubscribeService;

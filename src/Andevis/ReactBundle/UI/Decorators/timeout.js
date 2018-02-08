/**
 * Created by EvgenijE on 28.06.2017.
 */
/**
 * Timeout decorator
 * Usage:
 * @timeout(100)
 *
 * @param timeout
 * @returns {wrapper}
 */
// TODO: поправить ошибку, делает повторные отложеннные запросы, можно увидить при редактиговании EntityGrid
export default function timeout(timeout) {
    return function (wrapperClass, method) {
        if(process.env.CLIENT) {
            const timeoutedMethod = wrapperClass[method];
            wrapperClass[method] = function () {
                let t = 0;
                if(typeof this.__searchTimeoutId === 'undefined') {
                    this.__searchTimeoutId = [];
                } else {
                    t = timeout;
                }

                if (this.__searchTimeoutId[method]) {
                    clearTimeout(this.__searchTimeoutId[method]);
                }

                if(t > 0) {
                    this.__searchTimeoutId[method] = setTimeout(() => {
                        timeoutedMethod.apply(this, arguments);
                    }, t);
                } else {
                    timeoutedMethod.apply(this, arguments);
                }
            };
            return timeoutedMethod;
        } else {
            return wrapperClass[method];
        }
    };
}

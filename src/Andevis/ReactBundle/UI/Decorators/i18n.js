/*
 * react-andevis-i18n
 * 
 *
 * Copyright (c) 2017 Evgeny Elizarov
 * Licensed under the MIT license.
 */

/**
 * Created by EvgenijE on 20.06.2017.
 */
import PropTypes from 'prop-types';

// TODO: remove
/**
 * Translatable decorator for React Components
 * Usage:
 * @translatable(messages)
 * class MyComponent extends React.Component { ... }
 *
 * @param messages object
 * @returns {Function}
 */
function translatable(messages) {

    const wrapper = function (WrappedComponent) {
        const context = {
            intl: PropTypes.object
        };

        // Add intl context
        if (WrappedComponent.hasOwnProperty('contextTypes')) {
            WrappedComponent.contextTypes = Object.assign({}, WrappedComponent.contextTypes, context);
        } else {
            WrappedComponent.contextTypes = context;
        }

        // if (!prefix) {
        //     prefix = WrappedComponent.name;
        // }

        // Add intl message format shortcut
        const i18n = function (message, vars) {
            let translation = message;
            if(typeof message === 'object'){
                translation = this.context.intl.formatMessage(message, vars);
            } else if(message === 'string') {
                if ( messages.hasOwnProperty(message)){
                    translation = this.context.intl.formatMessage(messages[message], vars);
                }
            }

            return translation;
        };

        WrappedComponent.prototype.i18n = i18n;
        return WrappedComponent;
    };

    return wrapper;
}

const i18n = translatable;

export {
    i18n,
    translatable
};


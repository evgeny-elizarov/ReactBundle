import { addLocaleData, IntlProvider } from 'react-intl';
import { appState } from './../Stores';

/**
 * Get locale messages
 * @param locale
 */
const getLocaleMessages = (locale) => {
    let messages = {};
    try {
        const localeData = require('react-intl/locale-data/' + locale);
        addLocaleData([ ...localeData ]);
        messages = require('@app/i18n/lang/' + locale + '.json');
    } catch (e) {
        const localeData = require('react-intl/locale-data/en');
        addLocaleData([ ...localeData ]);
        messages = require('@app/i18n/lang/en.json');
    }
    return messages;
};

/**
 * Get intl
 */
const getIntl = (translationLocale) => {
    let intlProvider = appState.getIntlProvider();
    if(!intlProvider) {
        // Create the IntlProvider to retrieve context for wrapping around.
        const messages = getLocaleMessages(translationLocale);
        intlProvider = new IntlProvider({ locale: translationLocale, messages }, {});
        appState.setIntlProvider(intlProvider);
    }
    const { intl } = intlProvider.getChildContext();
    return intl;
};

/**
 * Translate message
 * @param message
 * @param vars
 * @param customLocale
 * @returns {*}
 */
const i18n = (message, vars, customLocale) => {
    const translationLocale = customLocale || appState.getLocale();
    const intl = getIntl(translationLocale);
    if(typeof message === 'string'){
        const messages = getLocaleMessages(translationLocale);
        if(messages.hasOwnProperty(message)){
            return intl.formatMessage(messages[message], vars);
        } else {
            return message;
        }
    } else {
        return intl.formatMessage(message, vars);
    }
};

export {
    getLocaleMessages,
    getIntl,
    i18n
}

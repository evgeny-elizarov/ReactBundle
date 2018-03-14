import 'babel-polyfill'; // Need for async/await functionality
import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from "react-router-dom";
import { GraphQLClient } from './GraphQL';
import { appState } from '@AndevisReactBundle/UI/Stores';
import { getLocaleMessages } from './Translation';
import { CookiesProvider } from 'react-cookie';
import UserProvider from "@AndevisAuthReactBundle/UI/Views/UserProvider/UserProvider";
import WindowsContainer from "@AndevisReactBundle/UI/Components/Windows/WindowsContainer";
//import registerServiceWorker from './Services/registerServiceWorker';


// TODO: describe this in wiki
// Here included auto-generated file viewConfig.js
// To generate file viewConfig.js run symfony command: php bin/console andevis:react:build:config
// import viewsConfig from '@app/UI/viewsConfig';
// this is the default behavior


// TODO:  refactor: remove ReactBundle(App) use View
export default class App extends React.Component
{

    static propTypes = {
        bundleName: PropTypes.string.isRequired,
        // stateStore: PropTypes.object.isRequired,
        locale: PropTypes.string.isRequired,
        basename: PropTypes.string.isRequired,
        // GraphQL: PropTypes.object,
        // afterLoginPath: PropTypes.string,
        // afterLogoutPath: PropTypes.string
    };

    static defaultProps = {
        basename: '/',
        locale: 'en'
    };

    static childContextTypes = {
        bundleName: PropTypes.string,
        viewsConfig: PropTypes.object,
        locale: PropTypes.string,
        appState: PropTypes.object,
        //aliasConfig: PropTypes.object
    };

    constructor(props){
        super(props);
        appState.setLocale(props.locale);
    }

    getChildContext() {

        return {
            bundleName: this.props.bundleName,
            viewsConfig: window.AndevisReactBundle.viewsUserHandlers, // TODO: generate viewsConfig to json
            //aliasConfig: require('@app/UI/aliasConfig.json'),
            locale: this.props.locale,
            appState: appState
        };
    }

    render (){
        const localeMessages = getLocaleMessages(appState.getLocale());
        // Detect dev mode
        const basename = (window.location.pathname.startsWith('/app_dev.php')) ? '/app_dev.php' : '/';
        return (
            <IntlProvider
                locale={appState.getLocale()}
                messages={localeMessages}
                ref={(provider) => { appState.setIntlProvider(provider); }} >
                <ApolloProvider client={GraphQLClient}>
                    <CookiesProvider>
                        <BrowserRouter basename={basename}>
                            <UserProvider>
                                <WindowsContainer>
                                    { this.props.children }
                                </WindowsContainer>
                            </UserProvider>
                        </BrowserRouter>
                    </CookiesProvider>
                </ApolloProvider>
            </IntlProvider>
        );
    }
};

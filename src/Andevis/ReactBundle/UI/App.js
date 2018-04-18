import 'babel-polyfill'; // Need for async/await functionality
import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from "react-router-dom";
import { apolloClient } from './GraphQL';
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
        messages: PropTypes.object.isRequired,
        // stateStore: PropTypes.object.isRequired,
        basename: PropTypes.string.isRequired,
        // GraphQL: PropTypes.object,
        // afterLoginPath: PropTypes.string,
        // afterLogoutPath: PropTypes.string
    };

    static defaultProps = {
        basename: '/',
    };

    static childContextTypes = {
        bundleName: PropTypes.string,
        viewsConfig: PropTypes.object,
        locale: PropTypes.string,
        appState: PropTypes.object,
        //aliasConfig: PropTypes.object
    };

    constructor(props, context){
        super(props, context);
        appState.setMessages(this.props.messages, appState.getLocale());
    }

    getChildContext() {

        return {
            bundleName: this.props.bundleName,
            viewsConfig: window.AndevisReactBundle.viewsUserHandlers, // TODO: generate viewsConfig to json
            //aliasConfig: require('@app/UI/aliasConfig.json'),
            locale: appState.getLocale(),
            appState: appState
        };
    }

    render (){
        // const localeMessages = getLocaleMessages(appState.getLocale());
        // Detect dev mode
        const basename = (window.location.pathname.startsWith('/app_dev.php')) ? '/app_dev.php' : '/';
        return (
            <IntlProvider
                locale={appState.getLocale()}
                messages={this.props.messages}
                ref={(provider) => { appState.setIntlProvider(provider); }} >
                <ApolloProvider client={apolloClient}>
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

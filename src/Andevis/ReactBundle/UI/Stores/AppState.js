import { observable, action, computed } from 'mobx';
import { assignClassProps } from './../Helpers';

export default class AppState {
    @observable user = null;
    @observable userPermissions = [];
    @observable userRoles = [];
    @observable locale = 'en'; // Default locale
    @observable intlProvider = null;
    @observable pendingRequestCount = 0;
    @observable fatalExceptionMessage = '';
    client = null;

    constructor(initialState, graphQLClient) {
        assignClassProps(this, initialState);
        this.client = graphQLClient;
    }

    @action('set locale')
    setLocale(locale) {
        this.locale = locale;
    }

    getLocale(){
        return this.locale;
    }

    @action('set intl provider')
    setIntlProvider(intlProvider){
        this.intlProvider = intlProvider;
    }

    getIntlProvider(){
        return this.intlProvider;
    }

    getClient() {
        return this.client;
    }

    @computed get isPendingRequests() {
        return this.pendingRequestCount > 0;
    }

    @action('set user')
    setUser(user) {
        this.user = user;
    }

    @action('set user permissions')
    setUserPermissions(permissions) {
        this.userPermissions = permissions;
    }

    @action('set user roles')
    setUserRoles(roles) {
        this.userRoles = roles;
    }

    @action('set fatal exception message')
    setFatalExceptionMessage(fatalExceptionMessage) {
        this.fatalExceptionMessage = fatalExceptionMessage;
    }

    @action('update session state')
    startPendingRequest() {
        this.pendingRequestCount = this.pendingRequestCount + 1;
    }

    @action('request completed')
    requestCompleted() {
        this.pendingRequestCount--;
    }
}



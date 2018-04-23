import React from 'react';
import { apolloClient } from './../GraphQL';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {BaseResolveConfig, QueryResolveConfig, MutationResolveConfig} from "../GraphQL";
import View from "./../Components/View/View";
import {ucfirst} from './../Helpers';
import { autobind } from 'core-decorators';
import ComponentEvent from "@AndevisReactBundle/UI/ComponentBase/ComponentEvent";
import shorthash from "shorthash";
import Listeners from 'listeners';
import { eventSubscribers } from '@AndevisReactBundle/UI/Events/EventSubscribers';

export default class Component extends React.Component {

    static propTypes = {
        name: PropTypes.string,
        index: PropTypes.number,
        enabled: PropTypes.bool,
        visible: PropTypes.bool,
        className: PropTypes.any,
        style: PropTypes.object,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func
    };

    static defaultProps = {
        enabled: true,
        visible: true
    };

    static contextTypes = {
        bundleName: PropTypes.string,
        viewsConfig: PropTypes.object.isRequired,
        view: PropTypes.object,
    };

    static childContextTypes = {};

    static bundleName = null;


    constructor(props, context) {
        super(props, context);

        // Name variable
        this.name = null;
        this.index = this.props.index;

        // If mounted flag
        this._mounted = false;

        // Private can change state flag
        this._canChangeState = true;

        this.processingEvents = [];


        // Load initial state
        let initialState = {};
        if(window.AndevisReactBundle.viewsInitialState.hasOwnProperty(this.getId()))
        {
            Object.assign(initialState, window.AndevisReactBundle.viewsInitialState[this.getId()]);
        }

        const frontendInitState = this.getInitialState();
        if(frontendInitState)
            Object.assign(initialState, frontendInitState);

        this.state = initialState;

        // Backend proxy object
        this.backend = new Proxy(this, {
            get: function (target, methodName) {
                return function wrapper() {
                    return target._requestBackend(methodName, arguments);
                };
            },
        });

        // Wrap render by permission checker method
        this.render = this.checkAccessBeforeCall(
            this.checkVisibleBeforeRender(this.render.bind(this)),
            this.constructor.renderErrorAccessDenied
        );

        // Wrap react Lifecycle methods
        const lifeCycleMethods = [
            'componentWillMount',
            'componentWillUnmount',
            'componentWillUpdate',
            'componentDidMount',
            'componentDidUpdate',
            'componentWillReceiveProps',
        ];
        lifeCycleMethods.forEach((method) => {
            this[method] = this.checkAccessBeforeCall(this[method].bind(this));
        });

        // Event listeners
        this.eventListeners = {};
        this.subscriptionOnEvents = {};

    }

    /**
     * Check visible
     * @param callback
     */
    checkVisibleBeforeRender(callback)
    {
        return (...args) => {
            if(this.visible) {
                return callback.apply(this, args);
            } else {
                return null;
            }
        };
    }

    /**
     * Render
     * @param callback
     * @param callbackDenied
     * @returns {function()}
     */
    checkAccessBeforeCall(callback, callbackDenied = null){
        return (...args) => {
            // Check access permission
            if(this.hasAccess()) {
                return callback.apply(this, args);
            } else {
                if(typeof callbackDenied === 'function'){
                    return callbackDenied(this);
                }
            }
        };
    }

    /**
     * Render error access denied
     * @param component
     * @return {null}
     */
    static renderErrorAccessDenied(component){
        return null;
    }

    hasAccess(){
        return true;
    }

    /**
     * Access method return boolean or list of permissions
     * @return boolean|Array
     */
    access(){
        // By default always allow access to component
        return true;
    }

    getChildContext() {
        return {};
    }

    getIndex(){
        return this.index;
    }

    getGlobalName() {
        return this.getView().getClassName() + ':' + this.getClassName() + ':' + this.getName();
    }

    /**
     * Get component short hash
     * @return {*}
     */
    getHashedGlobalId(){
        return shorthash.unique(this.getId());
    }

    /**
     * Get id
     * @returns {string}
     */
    getId() {
        return (Number.isInteger(this.getIndex())) ? this.getGlobalName() + ':' + this.getIndex() : this.getGlobalName();
    }

    /**
     * Get auto name
     * @returns {string}
     */
    getAutoName() {
        let className = this.constructor.name;
        if (className.substr(-9) === 'Component') {
            className = className.substr(0, className.length - 9);
        }
        // Generate name Class name + number
        let name = className;
        let n = 1;
        // TODO: add exception when limit
        while (n < 256) {
            name = className + n.toString();
            if (!this.getView().components.hasOwnProperty(name)) {
                break;
            }
            n++;
        }

        return name;
    }

    /**
     * Get name
     * @returns {string}
     */
    getName() {
        if (this.props.name) return this.props.name;
        if (this.name) return this.name;
        this.name = this.getAutoName();
        return this.name;
    }

    /**
     * Get access permission for current class
     * @return {*}
     */
    static getAccessPermission(){
        return this.getBackendClassName();
    }

    /**
     * Get frontend class name
     * @return {string}
     */
    static getJsClassName() {
        return this.toString().split ('(' || /s+/)[0].split (' ' || /s+/)[1];
    }

    /**
     * Get backend class name
     * @return {*}
     */
    static getBackendClassName(){
        // Get class name
        const className = this.getJsClassName();
        const bundleName = this.getBundleName();
        const viewGlobalId = bundleName+className+":"+bundleName+className+":"+className;

        if(window.AndevisReactBundle.viewsClassMap.hasOwnProperty(viewGlobalId)) {
            return window.AndevisReactBundle.viewsClassMap[viewGlobalId];
        } else {
            throw new Error('Check if backend class `'+className+'` is created for component with id `'+viewGlobalId+'`!');
        }
    }

    /**
     * Get bundle name
     * @returns {string}
     */
    static getBundleName() {
        if(typeof this.bundleName === 'string' && this.bundleName !== ''){
            return this.bundleName;
        }
        throw new Error('Can`t get bundle name! Add static variable bundleName to component class `' + this.getJsClassName() + '` !');
    }

    /**
     * Get short class name
     * @returns {string}
     */
    getShortClassName() {
        return this.constructor.name;
    }

    /**
     * Get class name
     * @returns {string}
     */
    getClassName() {
        return this.constructor.getBundleName() + this.getShortClassName();
    }

    // /**
    //  * Get component permission name
    //  * @return string
    //  * @throws \Exception
    //  */
    // getComponentPermissionName() {
    //     return this.constructor.getBundleName() + ":" + this.getView().getShortClassName() + ":" + this.getShortClassName();
    // }

    /**
     * get component initial state
     */
    getInitialState(){}

    /**
     * Check if final object has method
     */
    hasOwnMethod(name) {
        const desc = Object.getOwnPropertyDescriptor (Object.getPrototypeOf(this), name);
        return !!desc && typeof desc.value === 'function';
    }

    /**
     * Get component attribute state name
     * @param attributeName
     * @returns {*}
     */
    getAttributeStateName(attributeName) {
        return '_attribute' + ucfirst(attributeName);
    }

    /**
     * Get attribute value
     * @param attributeName
     * @param defaultValue
     * @returns {*}
     */
    getAttributeValue(attributeName, defaultValue) {
        const attributeStateName = this.getAttributeStateName(attributeName);
        if (this.state && this.state.hasOwnProperty(attributeStateName)) {
            return this.state[attributeStateName];
        }
        return defaultValue;
    }

    // TODO: Refactor setAttribute: Эта функция возвращает Promise соотвественно callback не нужен, можно использовать конструкцию .then()
    /**
     * Set attribute value
     * @param attributeName
     * @param value
     * @param callback
     */
    setAttributeValue(attributeName, value, callback) {
        let attributes = {};
        attributes[attributeName] = value;
        return this.setAttributes(attributes, callback);
    }

    // TODO: Refactor setAttributes: Эта функция возвращает Promise соотвественно callback не нужен, можно использовать конструкцию .then()
    /**
     * Set attributes
     * @param attributes
     * @param callback
     */
    setAttributes(attributes, callback)
    {
        const newState = {};
        Object.keys(attributes).forEach((key) => {
            const attributeName = this.getAttributeStateName(key);
            if(this.getAttributeValue(key) !== attributes[key]) {
                newState[attributeName] = attributes[key];
            }
        });
        return this.promisedSetState(newState).finally(() => {
            if(callback) callback();
        });
    }

    /**
     * Called before set new state from backend
     * @param nextState
     */
    componentWillReceiveBackendState(nextState){

    }

    /**
     * Called after set new state from backend
     * @param prevState
     */
    componentDidReceiveBackendState(prevState){

    }

    getAttributesLinkedToProps(){
        return [
            'enabled',
            'visible'
        ]
    }



    /**
     * Promised set state
     * @param newState
     */
    promisedSetState(newState)
    {
        return new Promise((resolve) => {
            if(this._canChangeState) {
                this.setState(newState, () => {
                    resolve(newState);
                });
            }
        });
    }



    /**
     * Attribute: visible
     * @returns {*}
     */
    get visible() {
        return this.getAttributeValue('visible', this.props.visible);
    }

    set visible(value) {
        this.setAttributeValue('visible', value);
    }

    /**
     * Attribute: enabled
     * @returns {*}
     */
    get enabled() {
        return this.getAttributeValue('enabled', this.props.enabled);
    }

    set enabled(value) {
        this.setAttributeValue('enabled', value);
    }

    /**
     * Attribute: hasFocus
     * @returns {*}
     */
    get hasFocus() {
        return this.getAttributeValue('hasFocus', false);
    }

    set hasFocus(value) {
        this.setAttributeValue('hasFocus', value);
    }

    /**
     * Attribute: backendEventProcessing
     * @returns {*}
     */
    get backendEventProcessing() {
        return this.getAttributeValue('backendEventProcessing', false);
    }

    set backendEventProcessing(value) {
        this.setAttributeValue('backendEventProcessing', value);
    }

    /**
     * Get schema name
     * @return string
     */
    getSchemaName() {
        return "ui" + this.getClassName();
    }

    /**
     * Resolve config
     * @returns {[null,null]}
     */
    resolveConfig() {
        return [
            new MutationResolveConfig(
                'resolveEvent',
                'event',
                'event: EventInput!',
                'result, userError, componentsUpdate { id, state { name, value } }'
            )
        ];
    }

    /**
     * Event list
     * @returns {[string,string]}
     */
    eventList() {
        return [
            'didMount',
            'willReceiveProps',
            'willUpdate',
            'didUpdate',
            'willUnmount',
            'callServerMethod',
            'focus',
            'blur'
        ];
    }

    /**
     * Get view
     * @returns {*}
     */
    getView() {
        if (this instanceof View ) return this;
        // if (this.context && this.context.view) console.log("getView", this.getName(), this.context.view);
        if (this.context && this.context.view ) return this.context.view;
        return null;
    }

    componentWillMount() {
        this.getView().mountComponent(this);
        this._mounted = true;
    }

    /*******************
     *
     *  EVENT: DID MOUNT
     *
     */
    componentDidMount() {
        this.didMount()
    }

    @autobind
    didMount() {
        return this.fireEvent('didMount');
    }

    beforeDidMount(component){};
    onDidMount(component){};
    afterDidMount(component){};

    /******************************
     *
     *   EVENT: WILL RECEIVE PROPS
     *
     */
    componentWillReceiveProps(nextProps) {
        this.willReceiveProps(nextProps).then(() => {
            const linkedAttributes = this.getAttributesLinkedToProps();

            let updateAttributes = {};
            linkedAttributes.forEach((attr) => {
                if (
                    nextProps.hasOwnProperty(attr) &&
                    this.props.hasOwnProperty(attr) &&
                    this.props[attr] !== nextProps[attr]
                ) {
                    updateAttributes[attr] = nextProps[attr];
                }
            });

            if(Object.keys(updateAttributes).length > 0){
                this.setAttributes(updateAttributes);
            }
        });
    }

    willReceiveProps(nextProps) {
        return this.fireEvent('willReceiveProps', nextProps);
    }

    beforeWillReceiveProps(component, nextProps) {}
    onWillReceiveProps(component, nextProps) {}
    afterWillReceiveProps(component, nextProps) {}


    /***************************
     *
     *  EVENT: WILL UPDATE
     *
     */
    componentWillUpdate(nextProps, nextState) {
        this.willUpdate(nextProps, nextState);
    }

    willUpdate(nextProps, nextState) {
        return this.fireEvent('willUpdate', nextProps, nextState);
    }

    // beforeWillUpdate(component, nextProps, nextState){}
    // onWillUpdate(component, nextProps, nextState){}
    // afterWillUpdate(component, nextProps, nextState){}

    /***********************
     *
     *  EVENT: DID UPDATE
     *
     */
    componentDidUpdate() {
        this.didUpdate();
    }

    didUpdate() {
        return this.fireEvent('didUpdate');
    }

    onDidUpdate(component){}


    /**************************
     *
     *  EVENT: WILL UNMOUNT
     *
     */
    componentWillUnmount() {
        this.unsubscribeAllEvents();
        this.clearAllEventListeners();
        this.willUnmount().then(() => {
            this.processingEvents.forEach((event) => {
                event.cancel();
            });
            this._canChangeState = false;
            this._mounted = false;
            this.getView().unmountComponent(this);
        });
    }

    willUnmount(){
        return this.fireEvent('willUnmount');
    }

    onWillUnmount(component){}


    /**
     * Focus event
     */
    @autobind
    focus() {
        return this.fireEvent('focus').then(() => this.setAttributes({hasFocus: true }) );
    }

    /**
     * Blur event
     */
    @autobind
    blur() {
        return this.fireEvent('blur').then(() => this.setAttributes({hasFocus: false}));
    }

    /**
     * Check if allow execute backend event handler
     * @param eventName
     * @returns {boolean}
     */
    allowCallEventBackend(eventName){
        if(eventName === 'callServerMethod'){
            return true;
        } else {
            return this.getView().isBackendUserHandlerExists(this, eventName);
        }
    }

    /**
     * User method caller event
     */
    callServerMethod(serverMethodName){
        let args = [].slice.call(arguments);
        args.unshift('callServerMethod');
        return this.fireEvent.apply(this, args);
    }

    /**
     * Here may prepare component state for event
     */
    prepareStateBeforeEvent(){
        return this.state;
    }

    prepareStateAfterEvent(nextState){
        return nextState;
    }

    /**
     * Fire component event
     * @returns {Promise}
     */
    fireEvent() {
        if(arguments.length === 0)
            throw new Error('Event name not set!');

        // Check if component exists in view
        if(!this.getView().getComponentById(this.getId())){
            console.warn('Component with id `' +this.getId()+ ' ` not exist in view ');
            return;
        }

        let args = [];
        Array.prototype.push.apply( args, arguments );

        const eventName = args.shift();

        if(!this._mounted){
            console.warn('Can`t fire event `'+eventName+'` for unmounted component `' + this.getName() + '`');
            return new Promise((resolve, reject) => {
                reject();
            });
        }

        const event = new ComponentEvent(this, eventName, args);
        this.processingEvents.push(event);
        return event.getPromise();
    }

    /**
     * Subscribe on event
     */
    subscribeOnEvent(eventName, callback){
        if(this.subscriptionOnEvents.hasOwnProperty(eventName)) {
            this.unsubscribeOnEvent(eventName, this.subscriptionOnEvents[eventName]);
        }
        this.subscriptionOnEvents[eventName] = callback;
        eventSubscribers.subscribe(eventName, callback, this);
    }

    /**
     * Unsubscribe on event
     */
    unsubscribeOnEvent(eventName, callback){
        eventSubscribers.unsubscribeComponent(eventName, callback, this);
        if(this.subscriptionOnEvents.hasOwnProperty(eventName)) {
            delete this.subscriptionOnEvents[eventName];
        }
    }

    /**
     * Unsubscribe all subscribed events
     */
    unsubscribeAllEvents(){
        Object.keys(this.subscriptionOnEvents).forEach((eventName) => {
            this.unsubscribeOnEvent(eventName, this.subscriptionOnEvents[eventName]);
        });
    }

    /**
     * Add event listener
     * @param eventName
     * @param callback
     * @param context
     */
    addEventListener(eventName, callback, context)
    {
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
     * Remove event listener
     * @param eventName
     * @param callback
     * @param context
     */
    removeEventListener(eventName, callback, context)
    {
        if(this.eventListeners.hasOwnProperty(eventName))
        {
            this.eventListeners[eventName].remove(callback, context);
        }
    }

    /**
     * Clear all event listeners
     */
    clearAllEventListeners(){
        Object.keys(this.eventListeners).forEach((eventName) => {
            this.eventListeners[eventName].clear();
            delete this.eventListeners;
        });
    }


    callUserHandler(handlerName, args, frontendCallback, backendCallback) {
        // Call frontend user handler
        if (typeof this.props[handlerName] === 'function') {
            this.props[handlerName].call(this, this, args, frontendCallback);
        }
    }


    /**
     * Get method resolver config
     * @param methodName
     * @returns {*}
     */
    getMethodResolverConfig(methodName) {
        // TODO: cache resolve config
        const resolveConfig = this.resolveConfig();
        if (resolveConfig) {
            for (let i in resolveConfig) {
                let resolver = resolveConfig[i];
                if (resolver.methodName === methodName) {
                    return resolver;
                }
            }
        }
        throw Error('Method `' + methodName + '`resolver not configured for component `' + this.constructor.name + '`. Check component resolveConfig function.');
    }

    /**
     * Ger resolver method schema name
     * @param resolverConfig
     * @returns {string}
     */
    getResolveMethodSchemaName(resolverConfig) {
        if (!(resolverConfig instanceof BaseResolveConfig))
            throw new Error('Bad resolver config type `' + resolverConfig + '`!');
        return this.getSchemaName() + '_' + resolverConfig.schemaName;
    }

    /**
     * Build method query args
     * @param resolverConfig
     */
    static buildMethodQueryArgs(resolverConfig) {
        let args = (resolverConfig.args) ? resolverConfig.args.split(",") : [];
        args.unshift('id: ID!');
        return args.map((arg) => {
            let p = arg.split(":");
            return "$" + p[0] + ": " + p[1];
        })
    }

    /**
     * Build method query field args
     * @param resolverConfig
     */
    static buildMethodQueryFieldArgs(resolverConfig) {
        let args = (resolverConfig.args) ? resolverConfig.args.split(",") : [];
        args.unshift('id: ID!');
        return args.map((arg) => {
            let p = arg.split(":");
            return p[0] + ":$" + p[0];
        });
    }

    /**
     * Request backend
     * @param methodName
     * @param args
     * @private
     */
    _requestBackend(methodName, args) {
        return new Promise((resolve, reject) => {

            // Check if component is child of view
            let resolverConfig = this.getMethodResolverConfig(methodName);

            // Make arguments as array
            // args = Object.values(args);
            let variables = args;

            if (variables === undefined || variables === null) variables = {};
            variables['id'] = this.getId();

            const queryName = this.getResolveMethodSchemaName(resolverConfig);

            // Prepare arguments
            const queryArgs = Component.buildMethodQueryArgs(resolverConfig);
            const fieldArgs = Component.buildMethodQueryFieldArgs(resolverConfig);
            const returnType = (resolverConfig.returnType) ? '{' + resolverConfig.returnType + '}' : '';

            if (resolverConfig instanceof QueryResolveConfig) {
                // Execute query
                apolloClient.query({
                    query: gql`
                        query ${queryName}(${queryArgs}){
                            ${queryName}(${fieldArgs}) ${returnType}
                        }
                    `,
                    variables: variables,
                    fetchPolicy: 'no-cache'
                }).then(({data}) => {
                    resolve(data[queryName]);
                }).catch(reject);



            } else if (resolverConfig instanceof MutationResolveConfig) {
                // Execute mutation
                apolloClient.mutate({
                    mutation: gql`
                    mutation ${queryName}(${queryArgs}){
                        ${queryName}(${fieldArgs}) ${returnType}
                    }
                    `,
                    variables: variables,
                    fetchPolicy: 'no-cache'
                }).then(({data}) => {
                    resolve(data[queryName]);
                }).catch(reject);

            } else {
                throw new Error('Bad resolver config type `' + resolverConfig.constructor + '`!');
            }
        });
    }



}

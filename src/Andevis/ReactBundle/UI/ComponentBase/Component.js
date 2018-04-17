import React from 'react';
import { GraphQLClient } from './../GraphQL';
import PropTypes from 'prop-types';
import {gql} from 'react-apollo';
import {BaseResolveConfig, QueryResolveConfig, MutationResolveConfig} from "../GraphQL";
import View from "./../Components/View/View";
import {ucfirst} from './../Helpers';
import { autobind } from 'core-decorators';
import ComponentEvent from "@AndevisReactBundle/UI/ComponentBase/ComponentEvent";
import shorthash from "shorthash";
import { authStore } from "@AndevisAuthReactBundle/UI/Stores";
import { hasPermission } from "@AndevisAuthReactBundle/UI/Helpers";


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
            throw new Error('Check if backend class `'+className+'` is created!');
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

    getAttributesLinkedToProps(){
        return [
            'enabled',
            'visible'
        ]
    }

    // componentDidUpdate(prevProps){
    //     const linkedAttributes = this.getAttributesLinkedToProps();
    //
    //     let updateAttributes = {};
    //     linkedAttributes.forEach((attr) => {
    //         if (prevProps.hasOwnProperty(attr) &&
    //             // typeof nextProps[attr] !== 'undefined'
    //             // &&
    //             (
    //                 // !this.props.hasOwnProperty(attr) ||
    //                 this.getAttributeValue(attr) !== this.props[attr]
    //             )
    //         ) {
    //             updateAttributes[attr] = this.props[attr];
    //         }
    //     });
    //
    //     if(Object.keys(updateAttributes).length > 0){
    //         this.setAttributes(updateAttributes);
    //     }
    //     // console.log("componentDidUpdate", prevProps, this.props);
    // }

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

    // /**
    //  * Attribute: mounted
    //  * @returns {*}
    //  */
    // get mounted() {
    //     return this.getAttributeValue('mounted', false);
    // }
    //
    // set mounted(value) {
    //     this.setAttributeValue('mounted', value);
    // }

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
            'willReceiveProps',
            'willUpdate',
            'didMount',
            'didUpdate',
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
    }

    componentWillUnmount() {
        this.processingEvents.forEach((event) => {
            event.cancel();
        });
        this._canChangeState = false;
        this.getView().unmountComponent(this);
    }

    componentWillUpdate(nextProps, nextState) {
        this.willUpdate(nextProps, nextState);
    }

    componentDidMount() {
        this.didMount()
    }

    componentDidUpdate() {
        this.didUpdate();
    }

    /**
     * Did mount event
     * @returns {Promise}
     */
    @autobind
    didMount() {
        return this.fireEvent('didMount');
    }

    didUpdate() {
        return this.fireEvent('didUpdate');
    }

    /**
     * Component will update
     * @param nextProps
     * @param nextState
     * @returns {Promise}
     */
    willUpdate(nextProps, nextState) {
        return this.fireEvent('willUpdate', nextProps, nextState);
    }

    /**
     * Will receive props event
     * @param nextProps
     * @returns {Promise}
     */
    willReceiveProps(nextProps) {
        return this.fireEvent('willReceiveProps', nextProps);
    }


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
        return this.getView().isBackendUserHandlerExists(this, eventName);
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

        const event = new ComponentEvent(this, eventName, args);
        this.processingEvents.push(event);
        return event.getPromise();
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
                GraphQLClient.query({
                    query: gql`
                        query ${queryName}(${queryArgs}){
                            ${queryName}(${fieldArgs}) ${returnType}
                        }
                    `,
                    variables: variables,
                    fetchPolicy: 'network-only'
                }).then(({data}) => {
                    resolve(data[queryName]);
                }).catch(reject);



            } else if (resolverConfig instanceof MutationResolveConfig) {
                // Execute mutation
                GraphQLClient.mutate({
                    mutation: gql`
                    mutation ${queryName}(${queryArgs}){
                        ${queryName}(${fieldArgs}) ${returnType}
                    }
                    `,
                    variables: variables,
                    fetchPolicy: 'network-only'
                }).then(({data}) => {
                    resolve(data[queryName]);
                }).catch(reject);

            } else {
                throw new Error('Bad resolver config type `' + resolverConfig.constructor + '`!');
            }
        });
    }



}

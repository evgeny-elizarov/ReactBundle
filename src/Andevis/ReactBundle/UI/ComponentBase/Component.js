import React from 'react';
import { GraphQLClient } from './../GraphQL';
import PropTypes from 'prop-types';
import {gql} from 'react-apollo';
import {BaseResolveConfig, QueryResolveConfig, MutationResolveConfig} from "../GraphQL";
import View from "./../Components/View/View";
import {ucfirst} from './../Helpers';
import ComponentEvent from "@AndevisReactBundle/UI/ComponentBase/ComponentEvent";

export default class Component extends React.Component {

    static propTypes = {
        name: PropTypes.string,
        index: PropTypes.number,
        enabled: PropTypes.bool
    };

    static defaultProps = {
        enabled: true
    };

    static contextTypes = {
        bundleName: PropTypes.string,
        viewsConfig: PropTypes.object.isRequired,
        view: PropTypes.object,
    };

    static childContextTypes = {};


    constructor(props, context) {
        super(props, context);

        // Name variable
        this.name = null;
        this.index = this.props.index;
        this.unmounted = false;

        this.processingEvents = [];


        // Load initial state
        let initialState = {};
        if(window.AndevisReactBundle.viewsInitialState.hasOwnProperty(this.getId()))
        {
            Object.assign(initialState, window.AndevisReactBundle.viewsInitialState[this.getId()]);
        }

        Object.assign(initialState, window.AndevisReactBundle.viewsInitialState[this.getId()]);

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
     * Get bundle name
     * @returns {string}
     */
    getBundleName() {

        // // TODO: можно упростить эту задачу таким орбазом - либо брать маппинг из webpack @BlaBlaBla и есть название бандла
        // // TODO: либо ложить в паку бандла файл типа bundleInfo.js который будет автоматически подключаться ко всем компонентам этого бандла
        // const name = (this.prototype) ? this.prototype.name : this;
        // console.log(this);
        throw new Error('getBundleName not implemented!. Add function getBundleName to component `' + this.getName() + '` !');
        // if (!this.context.bundleName)
        //     throw new Error('Bundle context not set for this component. Wrap the component in a Bundle tag');
        // return this.context.bundleName;
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
        return this.getBundleName() + this.getShortClassName();
    }

    /**
     * get component initial state
     */
    getInitialState(){}


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

    /**
     * Set attribute value
     * @param attributeName
     * @param value
     * @param callback
     */
    setAttributeValue(attributeName, value, callback) {
        let state = {};
        state[this.getAttributeStateName(attributeName)] = value;
        if(!this.unmounted){
            this.setState(state, callback);
        }
    }

    /**
     * Set attributes
     * @param values
     * @param callback
     */
    setAttributes(values, callback)
    {
        const newState = {};
        Object.keys(values).forEach((key) => {
            const attributeName = this.getAttributeStateName(key);
            newState[attributeName] = values[key];
        });
        this.setState(newState, callback);
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
                'result, componentsUpdate { id, state { name, value } }'
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
            'refresh',
            'focus',
            'blur'
        ];
    }

    /**
     * Get view
     * @returns {*}
     */
    getView() {
        if (this instanceof View) return this;
        if (this.context && this.context.view instanceof View) return this.context.view;
        return null;
    }

    componentWillMount() {
        this.getView().mountComponent(this);
    }

    componentWillUnmount() {
        this.processingEvents.forEach((event) => {
            event.cancel();
        });
        this.unmounted = true;
        this.getView().unmountComponent(this);
    }

    componentDidMount() {
        this.didMount();
    }

    didMount() {
        return this.fireEvent('didMount');
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
        // console.log(this.getName(), 'fireEvent', eventName);
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

    /**
     * Refresh event handler
     */
    refresh() {
        return this.fireEvent('refresh');
    }

    /**
     * Focus event handler
     */
    focus() {
        const attrHasFocus = this.getAttributeStateName('hasFocus');
        const newState = {};
        newState[attrHasFocus] = true;
        this.setState(newState, () => {
            this.fireEvent('focus');
        });
    }

    /**
     * Blur event handler
     */
    blur() {
        const attrHasFocus = this.getAttributeStateName('hasFocus');
        const newState = {};
        newState[attrHasFocus] = false;
        this.setState(newState, () => {
            this.fireEvent('blur');
        });
    }

}

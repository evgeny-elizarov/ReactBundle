import React from 'react';
import GraphQL from '@AndevisGraphQLBundle/UI/GraphQL';
import PropTypes from 'prop-types';
import {gql} from 'react-apollo';
import {BaseResolveConfig, QueryResolveConfig, MutationResolveConfig} from "../GraphQL";
import View from "./../Components/View/View";
import {ucfirst} from './../Helpers';
import {ComponentDataToJsonString} from "../Helpers/base";

export default class Component extends React.Component {

    static propTypes = {
        name: PropTypes.string,
        index: PropTypes.number
    };
    static defaultProps = {};
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
        this._willUnmount = false;

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
        if(!this._willUnmount){
            this.setState(state, callback);
        }
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
        return this.getAttributeValue('enabled', true);
    }

    set enabled(value) {
        this.setAttributeValue('enabled', value);
    }

    /**
     * Attribute: hasFocus
     * @returns {*}
     */
    get hasFocus() {
        return this.getAttributeValue('hasFocus', true);
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
        this._willUnmount = true;
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
    allowCallBackend(eventName){
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
        const eventName = arguments[0];
        // console.log(this.getName(), 'fireEvent', eventName);
        const eventComponent = this;
        return new Promise((resolve, reject) => {
            (async () => {
                let eventResult = null;

                // // Set component attribute event processing
                // let newState = {};
                // newState[this.getAttributeStateName('eventProcessing')] = true;
                // await this.setState(newState);

                //
                // Prepare state
                //
                // let componentsUpdatedState = {};
                // componentsUpdatedState[this.getId()] = {};
                // componentsUpdatedState[this.getId()][this.getAttributeStateName('eventProcessing')] = false;
                //
                // // TODO: move it do didMount method
                // if (eventName === 'didMount')
                //     componentsUpdatedState[this.getId()][this.getAttributeStateName('mounted')] = true;
                //
                // let componentsUpdatesOrder = [];
                // componentsUpdatesOrder.push(this.getId());

                /** @var View **/
                const view = this.getView();

                //
                // 1. Call frontend before user event handler
                //
                console.log(this.getId(), this.getName(), eventName, "step 1 before");
                const viewBeforeUserHandlerName = this.getName() + '_before' + ucfirst(eventName);
                if (typeof this.getView()[viewBeforeUserHandlerName] === 'function') {
                    arguments[0] = this;
                    eventResult = await this.getView()[viewBeforeUserHandlerName].apply(this.getView(), arguments);
                    if(eventResult === false) {
                        //console.log("AA");
                        resolve(eventResult);
                        return false;
                    }
                    // needCallBackend = (ret !== false);
                }

                //
                // 2. Call frontend user event handler
                //
                const viewUserHandlerName = this.getName() + '_on' + ucfirst(eventName);
                //console.log(this.getName(), eventName, "step 2 on:frontend");
                if (typeof this.getView()[viewUserHandlerName] === 'function') {
                    arguments[0] = this;
                    eventResult = await this.getView()[viewUserHandlerName].apply(this.getView(), arguments);
                    // needCallBackend = (ret !== false);
                    // If backend return false, skip frontend event callbacks
                    if(eventResult === false) {
                        //console.log("DD");
                        resolve(eventResult);
                        return;
                    }
                }

                //
                // 3. Call backend user event handler (if exists)
                //
                // console.log(this.getName(), eventName, "step 3 on:backend");
                if(this.allowCallBackend(eventName)) {


                    let componentsUpdatedState = {};
                    let componentsUpdatesOrder = [];
                    componentsUpdatesOrder.push(this.getId());

                    // Prepare event arguments
                    let queryArgs = {
                        event: {
                            eventName: eventName,
                            arguments: [],
                            components: []
                        }
                    };

                    // Prepare event arguments
                    let args = [];
                    for (let i in arguments){
                        if(arguments.hasOwnProperty(i)){
                            if(i > 0){
                                args.push(arguments[i]);
                            }
                        }
                    }
                    queryArgs.event.arguments = ComponentDataToJsonString(args);

                    // Prepare components status update for backend
                    for (let i in view.componentMountStack) {



                        const component = view.componentMountStack[i];

                        let componentData = {
                            id: component.getId()
                        };

                        // Prepare component props
                        if (component.props) {
                            componentData['props'] = [];
                            for (let name in component.props) {
                                if (component.props.hasOwnProperty(name)) {
                                    // Skip REACT components
                                    if (component.props[name] instanceof React.Component) continue;
                                    if (name === 'children') continue;
                                    componentData['props'].push({
                                        name: name,
                                        value: ComponentDataToJsonString(component.props[name])
                                    });
                                }
                            }
                        }

                        // Prepare component state
                        const state = component.prepareStateBeforeEvent();

                        if (state) {
                            componentData['state'] = [];
                            for (let name in state) {
                                if (state.hasOwnProperty(name)) {
                                    // Skip REACT components
                                    if (state[name] instanceof React.Component) {
                                        continue;
                                    }
                                    componentData['state'].push({
                                        name: name,
                                        value: ComponentDataToJsonString(state[name])
                                    });
                                }
                            }
                        }
                        queryArgs.event.components.push(componentData);
                    }

                    // Call backend event resolver
                    let queryResult = null;
                    try {
                        //console.log(this.getName(), eventName, "B", queryArgs);
                        queryResult = await this.backend.resolveEvent(queryArgs);
                    } catch (e) {
                        //console.log(this.getName(), eventName, "C");
                        // TODO: create system critial message
                        alert(e);
                        reject(e);
                        return;
                    }
                    //console.log(this.getName(), eventName, "D");

                    if (queryResult) {

                        // Convert string boolean to boolean
                        eventResult = JSON.parse(queryResult.result);

                        //
                        // Update component state from backend
                        //
                        queryResult.componentsUpdate.forEach((componentUpdate) => {
                            // const componentName = componentUpdate.id.split(":")[2];
                            // const component = this.getView().getComponentByName(componentName);

                            // Prepare new state object
                            let newState = {};
                            componentUpdate.state.forEach((state) => {
                                newState[state.name] = JSON.parse(state.value);
                            });

                            const updateComponent = this.getView().getComponentById(componentUpdate.id);
                            componentsUpdatedState[componentUpdate.id] = updateComponent.prepareStateAfterEvent(newState);
                            if (componentUpdate.id !== eventComponent.getId())
                                componentsUpdatesOrder.push(componentUpdate.id);

                        });
                    }

                    // Update component state by one step
                    for (let i in componentsUpdatesOrder) {
                        const componentId = componentsUpdatesOrder[i];
                        try {
                            const component = this.getView().getComponentById(componentId);
                            if(componentsUpdatedState[componentId]) {
                                // console.log(this.getName(), "fireEvent", eventName, "Update component state", componentId);
                                component.setState(componentsUpdatedState[componentId]);
                            }
                        } catch (e) {
                            if (e.name === 'ComponentNotFound') {
                                // Компонетн может быть уже отмонтирован событием на фронтенде
                            } else {
                                throw e;
                            }
                        }
                    }


                    // If backend return false, skip frontend event callbacks
                    if(eventResult === false) {
                        //console.log("CC");
                        resolve(eventResult);
                        return;
                    }
                }

                //
                // 4. Call frontend after user event handler
                //
                //console.log(this.getName(), eventName, "step 4 after:frontend");
                const viewAfterUserHandlerName = this.getName() + '_after' + ucfirst(eventName);
                if (typeof this.getView()[viewAfterUserHandlerName] === 'function') {
                    let afterArguments = [this, eventResult];
                    eventResult = await this.getView()[viewAfterUserHandlerName].apply(this.getView(), afterArguments);
                    // needCallBackend = (ret !== false);
                    // If backend return false, skip frontend event callbacks
                    if(eventResult === false) {
                        //console.log("EE");
                        resolve(eventResult);
                        return;
                    }
                }

                // // Set component attribute event processing
                // newState = {};
                // newState[this.getAttributeStateName('eventProcessing')] = false;
                // await this.setState(newState);

                //console.log(this.getName(), eventName, "eventComplete");

                (eventResult === false) ? reject(eventResult) : resolve(eventResult);
            })();
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
            args = Object.values(args);
            let variables = args[0];

            if (variables === undefined || variables === null) variables = {};
            variables['id'] = this.getId();

            const queryName = this.getResolveMethodSchemaName(resolverConfig);

            // Prepare arguments
            const queryArgs = Component.buildMethodQueryArgs(resolverConfig);
            const fieldArgs = Component.buildMethodQueryFieldArgs(resolverConfig);
            const returnType = (resolverConfig.returnType) ? '{' + resolverConfig.returnType + '}' : '';

            if (resolverConfig instanceof QueryResolveConfig) {
                // Execute query
                GraphQL.query({
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
                GraphQL.mutate({
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

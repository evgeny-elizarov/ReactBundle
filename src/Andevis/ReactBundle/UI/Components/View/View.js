import React from 'react';
import PropTypes from 'prop-types';
import { Component } from './../../ComponentBase';
// import MutationResolveConfig from "../../GraphQL/MutationResolveConfig";
import { ComponentNotFoundException } from "./../../Exceptions";
import { ucfirst } from "@AndevisReactBundle/UI/Helpers";
import globState from "@AndevisReactBundle/state";
import { autobind } from "@AndevisReactBundle/decorators";
import viewStack from './viewStack';
import { authStore } from "@AndevisAuthReactBundle/UI/Stores";

/**
 * The root view should be named as well as the bundle.
 */
export default class View extends Component
{
    static childContextTypes = Object.assign({}, Component.childContextTypes, {
        bundleName: PropTypes.string,
        view: PropTypes.object.isRequired,
    });

    static contextTypes = Object.assign({}, Component.contextTypes, {
        router: PropTypes.object,
        userProvider: PropTypes.object,
        intl: PropTypes.object
    });

    globalStateWillUpdateSubs = null;
    globalStateDidUpdateSubs = null;
    globalStateBindedSubs = null;
    globalStateAutoUpdateKeys = [];
    // globalInitState = {};

    constructor(props, context){
        super(props, context);

        // Mounted components by name
        this.components = {};

        // Components by Id
        this.componentsById = [];

        // Component mount stack
        this.componentMountStack = [];

        // Load initial state
        let viewInitialGlobalState = {};
        if(window.AndevisReactBundle.viewsInitialGlobalState.hasOwnProperty(this.getId()))
        {
            viewInitialGlobalState = Object.assign(
                viewInitialGlobalState,
                window.AndevisReactBundle.viewsInitialGlobalState[this.getId()]
            );
        }

        if(this.hasOwnMethod('getInitialGlobalState')){
            const state = this.getInitialGlobalState();
            if(state)
                viewInitialGlobalState = Object.assign(viewInitialGlobalState, state)
        }
        // this.globalInitState = viewInitialGlobalState;
        this.globalStateAutoUpdateKeys = Object.keys(viewInitialGlobalState);
        this.setGlobalState(viewInitialGlobalState);


        this.render = this.renderIfAllowedWrapper(this.render.bind(this));

        // this.state = {
        //     globState: {}
        // }
        // Next event components update
        // TODO: remove
        // this.eventComponentsUpdate = {};

        // // TODO: remove
        // this.componentsStateUpdates = {};
        // // this.componentsInitState = {};
    }

    /**
     * Render
     * @param render
     * @returns {function()}
     */
    renderIfAllowedWrapper(render){
        return () => {
            let isGranted = true;
            if(this.context.userProvider) {
                const permissions = authStore.userPermissions;
                if(
                    permissions.hasOwnProperty('UI') &&
                    permissions && permissions['UI'].hasOwnProperty(this.getComponentPermissionName())
                ){
                    isGranted = permissions['UI'][this.getComponentPermissionName()];
                }
            }
            if(isGranted) return render();
            else return (this.props.children) ? React.Children.only(this.props.children) : null;
        };
    }

    getName(){
        return this.constructor.name;
    }

    getBundleName(){
        if(!this.context || !this.context.hasOwnProperty('bundleName')) {
            throw new Error('Bundle context not set for this component. Wrap the component in a Bundle tag');
        }
        return this.context.bundleName;
    }

    getChildContext() {
        return {
            view: this
        };
    }

    /**
     * Get component permission name
     * @param $className
     * @return string
     * @throws \Exception
     */
    getComponentPermissionName() {
        return this.getBundleName()+":"+this.getShortClassName();
    }

    /**
     * Get view by name
     */
    getViewByName(viewName){
        let bundleName = this.getBundleName();
        if(viewName.indexOf(":") !== -1){
            [bundleName, viewName] = viewName.split(":", 2);
        }
        return viewStack.getByGlobalName(bundleName + ":" + viewName);
    }

    componentWillMount(){
        viewStack.register(this);

        // if(this.hasOwnMethod(this.globalInitState)){
        //     this.setGlobalState(this.globalInitState);
        // }
        super.componentWillMount();
    }

    componentDidMount(){


        if(this.hasOwnMethod('globalStateWillUpdate')){
            this.globalStateWillUpdateSubs = globState.subscribeWillUpdate(this.globalStateWillUpdate.bind(this));
        }

        if(this.hasOwnMethod('globalStateDidUpdate')){
            this.globalStateDidUpdateSubs = globState.subscribeDidUpdate(this.globalStateDidUpdate.bind(this));
        }

        if(this.globalStateAutoUpdateKeys.length > 0) {
            this.globalStateBindedSubs = globState.subscribeDidUpdate(this.handleBindedGlobalState.bind(this));
        }

        super.componentDidMount();
    }

    componentWillUnmount(){

        globState.unsubscribeWillUpdate(this.globalStateWillUpdateSubs);
        globState.unsubscribeDidUpdate(this.globalStateDidUpdateSubs);
        globState.unsubscribeDidUpdate(this.globalStateBindedSubs);

        super.componentWillUnmount();

        viewStack.unregister(this);
    }

    /**
     * Обновляет инициализированные ключи глобального состояния
     */
    handleBindedGlobalState(prevState) {
        let needUpdate = false;
        this.globalStateAutoUpdateKeys.forEach((key) => {
            if(this.globalState.hasOwnProperty(key)){
                if(!prevState.hasOwnProperty(key)){
                    needUpdate = true;
                } else {
                    if(this.globalState[key] !== prevState[key]) needUpdate = true;
                }
            }
        });

        if(needUpdate) this.forceUpdate();
    }

    /**
     * Инициализирует глобальные переменные при монтировании View
     * @return {object}
     */
    getInitialGlobalState() {}

    /**
     * Вызывается при перед изменением глобального состояния
     * @param nextState
     */
    globalStateWillUpdate(nextState){}


    /**
     * Вызывается после изменения глобального состояния
     * @param prevState
     */
    globalStateDidUpdate(prevState){}


    /**
     * Возвращает текущее глобальное состояние
     * @return {object}
     */
    get globalState(){
        return globState.state;
    }

    /**
     * Установить глобальное состояние
     * @param {object} state
     */
    setGlobalState(state){
        globState.setState(state);
    }


    /**
     * Check if user handler exists on backend
     * @param component
     * @param eventName
     * @returns {boolean}
     */
    isBackendUserHandlerExists(component, eventName){
        if(!this.context || !this.context.hasOwnProperty('viewsConfig')){
            throw new Error('viewsConfig not set in view context');
        }
        const userHandlerName = component.getName()+'_on' + ucfirst(eventName);
        if(this.context.viewsConfig[this.getGlobalName()] !== undefined){

            return this.context.viewsConfig[this.getGlobalName()].includes(userHandlerName);
        }
    }

    /**
     * Get backend user handlers
     * @returns {*}
     */
    getBackendUserHandlers(){
        if(this.context.viewsConfig[this.getGlobalName()] !== undefined){
            return this.context.viewsConfig[this.getGlobalName()];
        }
    }

    /**
     * Get component by id
     */
    getComponentById(id) {
        if(!this.componentsById.hasOwnProperty(id)){
            throw new ComponentNotFoundException('Component with id `'+id+'` not mounted');
        }
        return this.componentsById[id];
    }

    /**
     * Get component by name
     */
    getComponentByName(name) {
        if(!this.components[name]){
            throw new Error('Component with name `'+name +'` not found ');
        }
        return this.components[name];
    }


    /**
     * Mount component to view
     * @param component
     */
    mountComponent(component){

        if(this.componentsById.hasOwnProperty(component.getId())){
            throw new Error('Component with ID `'+component.getId()+'` is already registered!');
        }
        // Add component to mount stack
        this.componentMountStack.push(component);

        // Add components to register by ID
        this.componentsById[component.getId()] = component;

        // Add component to register by Name
        if(Number.isInteger(component.index)) {
            if (this.components.hasOwnProperty(component.getName())) {
                if (!Array.isArray(this.components[component.getName()])) {
                    throw new Error('Component with name `' + component.getName() + '` already mounted in view without index. Rename this component or add index to component with same name.');
                }
                if (typeof this.components[component.getName()][component.index] !== 'undefined') {
                    throw new Error('Component with name `' + component.getName() + '` and index `' + component.index + '` already mounted');
                }
            } else {
                // ... create component array
                this.components[component.getName()] = [];
            }
            this.components[component.getName()][component.index] = component;
        } else {
            if (this.components.hasOwnProperty(component.getName())) {
                if(Array.isArray(this.components[component.getName()])){
                    throw new Error('Component with name `'+ component.getName() + '` already mounted in view with index. Add index to this component or rename component with same name.');
                }
                throw new Error('Component with name `' + component.getName() + '` already mounted. Rename component or add index to both components with same name.');
            }
            this.components[component.getName()] = component;
        }
    }

    /**
     * Unmount component from view
     * @param component
     */
    unmountComponent(component){
        if(!this.componentsById.hasOwnProperty(component.getId())){
            throw new Error('Component with ID `'+ component.getName() + '` not registered in view `'+this.constructor.name+'`!');
        }

        if(!this.components.hasOwnProperty(component.getName())){
            throw new Error('Component with name `'+ component.getName() + '` not registered in view `'+this.constructor.name+'`!');
        }

        // Remove component from mount stack
        const i = this.componentMountStack.indexOf(component);
        this.componentMountStack.splice(i, 1);

        // Remove from register by ID
        delete this.componentsById[component.getId()];

        // Remove component from register by Name
        if(Number.isInteger(component.index)){
            delete this.components[component.getName()][component.index];
        } else {
            delete this.components[component.getName()];
        }
    }

    /**
     * Event list
     * @returns {[string,string]}
     */
    eventList() {
        return super.eventList().concat(['callServerMethod']);
    }

    /**
     * Allow fire callServerMethod event
     * @param eventName
     * @return {boolean}
     */
    allowCallEventBackend(eventName){
        if(eventName === 'callServerMethod'){
            return true;
        } else {
            return super.allowCallEventBackend(eventName);
        }
    }

    /**
     * User method caller event
     */
    callServerMethod(serverMethodName){
        var args = [].slice.call(arguments);
        args.unshift('callServerMethod');
        return this.fireEvent.apply(this, args);
    }

    render(){
        return (this.visible) ? React.Children.only(this.props.children) : null
    }

};

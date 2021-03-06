import React from 'react';
import PropTypes from 'prop-types';
import { Component } from '../../ComponentBase/index';
// import MutationResolveConfig from "../../GraphQL/MutationResolveConfig";
import { ComponentNotFoundException } from "../../Exceptions/index";
import { ucfirst } from "@AndevisReactBundle/UI/Helpers";
import globState from "@AndevisReactBundle/state";
import { autobind } from "@AndevisReactBundle/decorators";
import viewStack from './viewStack';
import { authStore } from "@AndevisAuthReactBundle/UI/Stores";
import { isGranted, hasPermission } from "@AndevisAuthReactBundle/UI/Helpers";
import messages from "@AndevisReactBundle/UI/Components/Page/messages";
import { i18n } from "@AndevisReactBundle/UI/Translation";
import ErrorAccessForbidden from './Errors/ErrorAccessForbidden';

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

    _hasAccess = null;
    // globalInitState = {};

    constructor(props, context){
        super(props, context);

        // Mounted components by name
        this.components = {};

        // Components by Id
        this.componentsById = [];

        // Component mount stack
        this.componentMountStack = [];

        this._hasAccess = null;

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

    // /**
    //  * Access method return boolean or list of permissions
    //  * @return boolean|Array
    //  */
    // access(){
    //     // By default check UI component permission
    //     return [
    //         'UI:' + this.getComponentPermissionName()
    //     ]
    // }

    // TODO: сделать кэширование результатов (см. бэкенд)
    hasAccess(){
        let hasAccess = true;
        // 1. Check access permission
        if(hasPermission('UI:Access', this.constructor.getBackendClassName()))
        {
            if(this.context.userProvider) {
                hasAccess = isGranted('UI:Access', this.constructor.getAccessPermission())
            }
        }

        // 2. Check user custom logic in access method
        if(hasAccess){
            hasAccess = this.access();
        }

        return hasAccess;
    }

    getName(){
        return this.constructor.name;
    }

    // /**
    //  * Return view bundle name
    //  */
    // static bundleName(){
    //     throw new Error('Bundle context not set for this component. Create static method `bundleName` for this class');
    // }

    // getBundleName(){
    //     if(!this.context || !this.context.hasOwnProperty('bundleName')) {
    //         throw new Error('Bundle context not set for this component. Wrap the component in a Bundle tag');
    //     }
    //     return this.context.bundleName;
    // }

    // TODO: Не использовать эту функцию, использовать getNamespace
    /**
     * Get backend class name
     * @return {*}
     */
    _getBackendClassName(){
        if(window.AndevisReactBundle.viewsClassMap.hasOwnProperty(this.getId())) {
            return window.AndevisReactBundle.viewsClassMap[this.getId()];
        }
    }

    getChildContext() {
        return {
            view: this
        };
    }

    // // TODO: проверить что эта функция не дублирует getAccessPermission
    // /**
    //  * Get component permission name
    //  * @return string
    //  * @throws \Exception
    //  */
    // getComponentPermissionName() {
    //     return this.getBundleName()+":"+this.getShortClassName();
    // }

    /**
     * Get view by name
     */
    getViewByName(viewName){
        let bundleName = this.constructor.getBundleName();
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

        this._hasAccess = null; // Reset has access cache
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

    componentWillReceiveProps(nextProps){
        this._hasAccess = null; // Reset has access cache
        super.componentWillReceiveProps(nextProps);
    }

    componentWillUnmount(){

        globState.unsubscribeWillUpdate(this.globalStateWillUpdateSubs);
        globState.unsubscribeDidUpdate(this.globalStateDidUpdateSubs);
        globState.unsubscribeDidUpdate(this.globalStateBindedSubs);

        super.componentWillUnmount();

        viewStack.unregister(this);
        this._hasAccess = null; // Reset has access cache
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
     * Register component to view
     * @param component
     */
    registerComponent(component){

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
     * Un register component from view
     * @param component
     */
    unregisterComponent(component){
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
     * Render error access denied
     * @return {*}
     */
    static renderErrorAccessDenied(component) {
        if(isGranted('System:Show technical information', 'Debug')){
            return <ErrorAccessForbidden component={component}/>
        }
        return null;
    }

    render(){
        return React.Children.only(this.props.children);
    }

};

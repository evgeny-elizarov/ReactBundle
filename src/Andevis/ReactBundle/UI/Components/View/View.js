import React from 'react';
import PropTypes from 'prop-types';
import { Component } from './../../ComponentBase';
// import MutationResolveConfig from "../../GraphQL/MutationResolveConfig";
import { ComponentNotFoundException } from "./../../Exceptions";
import { ucfirst } from "@AndevisReactBundle/UI/Helpers";

/**
 * The root view should be named as well as the bundle.
 */
export default class View extends Component
{
    static childContextTypes = Object.assign({}, Component.childContextTypes, {
        bundleName: PropTypes.string,
        view: PropTypes.object.isRequired
    });

    constructor(props, context){
        super(props, context);

        // Mounted components by name
        this.componentsByName = {};

        // Component mount stack
        this.componentMountStack = [];

        // Next event components update
        // TODO: remove
        // this.eventComponentsUpdate = {};

        // // TODO: remove
        // this.componentsStateUpdates = {};
        // // this.componentsInitState = {};
    }

    getName(){
        return this.constructor.name;
    }

    getBundleName(){
        if(!this.context || !this.context.hasOwnProperty('bundleName')) {
            debugger;
            throw new Error('Bundle context not set for this component. Wrap the component in a Bundle tag');
        }
        return this.context.bundleName;
    }

    getChildContext() {
        return {
            view: this
        };
    }

    // /**
    //  * Resolve config
    //  * @returns {[null,null]}
    //  */
    // resolveConfig(){
    //     let config = super.resolveConfig();
    //     config.push(
    //         new MutationResolveConfig(
    //             'reactOnInit',
    //             'init',
    //             'components: [ComponentInput!]',
    //             `componentsUpdateState {
    //                 componentId,
    //                 updateState {
    //                     name, value
    //                 }
    //             }`)
    //     );
    //     return config;
    // }


    // componentDidMount(){
    //     //super.componentDidMount();
    //     // Load object
    //     if(!this.loaded) this.load();
    // }
    //
    // /**
    //  * Load all components in stack
    //  */
    // load(){
    //     this.fireEvent('load', null, true);
    // }

    // componentDidUpdate(){
    //     console.log("componentDidUpdate", this.initialized);
    //     // Initialize object
    //     if(!this.initialized){
    //         this.init();
    //     }
    // }

    //
    // /**
    //  * TODO: remove
    //  * Initialize view
    //  */
    // init() {
    //     // Prepare registered components data
    //     let components = [];
    //     Object.values(this.componentsByName).forEach((component) => {
    //         components.push({
    //             componentId: component.getId(),
    //             status: 'MOUNTED',
    //             updateState: component.getStateAttributes()
    //         });
    //     });
    //     // Init view on backend
    //     return new Promise((resolve, reject) => {
    //
    //         (async () => {
    //
    //             //
    //             // 1. Call frontend inti handlers for all components
    //             //
    //             (async () => {
    //                 await Promise.all(Object.values(this.componentsByName).map(async (component) => {
    //                     let viewUserHandlerName = component.getName() + '_init';
    //                     if (typeof this.getView()[viewUserHandlerName] === 'function') {
    //                         await this.getView()[viewUserHandlerName].call(this, this);
    //                     }
    //                 }));
    //             })();
    //
    //             //
    //             // 2. Call view backend init
    //             //
    //
    //             // Search backend init handlers
    //             let gotOnOrMoreInit = false;
    //             let backendUserHandlers = this.getBackendUserHandlers();
    //             for(let i in backendUserHandlers){
    //                 if(backendUserHandlers.hasOwnProperty(i)){
    //                     let userHandler = backendUserHandlers[i];
    //                     if(userHandler.split('_')[1] === 'init'){
    //                         gotOnOrMoreInit = true;
    //                         break;
    //                     }
    //                 }
    //             }
    //
    //             if(gotOnOrMoreInit)
    //             {
    //                 const viewInitStatus = await this.backend.reactOnInit({ components: components });
    //                 //
    //                 // 3. Update state after all events
    //                 //
    //                 // Prepare new component state from backend
    //                 let componentsNewState = {};
    //                 viewInitStatus.componentsUpdateState.forEach((componentUpdateState) => {
    //
    //                     const componentName = componentUpdateState.componentId.split(":")[2];
    //
    //                     // Prepare new state object
    //                     componentsNewState[componentName] = {};
    //                     // componentsNewState[componentName] = {};
    //                     componentUpdateState.updateState.forEach((stateAttribute) => {
    //                         componentsNewState[componentName][stateAttribute.name] = JSON.parse(stateAttribute.value);
    //                     });
    //                 });
    //
    //                 // Initialize all components
    //                 Object.values(this.componentsByName).forEach((component) => {
    //                     if (componentsNewState[component.getName()] === undefined) {
    //                         componentsNewState[component.getName()] = {};
    //                     }
    //                     // Set initialization flag
    //                     Object.assign(componentsNewState[component.getName()], {
    //                         _propertyInitialized: true
    //                     });
    //
    //                     // Update component state
    //                     component.setState(componentsNewState[component.getName()], null, true);
    //                 });
    //             } else {
    //                 // Initialize all components
    //                 Object.values(this.componentsByName).forEach((component) => {
    //                     component.setState({
    //                         _propertyInitialized: true
    //                     }, null, true);
    //                 });
    //             }
    //
    //             resolve();
    //         })();
    //
    //     });
    //
    // }


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
        if(this.context.viewsConfig[this.getId()] !== undefined){

            return this.context.viewsConfig[this.getId()].includes(userHandlerName);
        }
    }

    /**
     * Get backend user handlers
     * @returns {*}
     */
    getBackendUserHandlers(){
        if(this.context.viewsConfig[this.getId()] !== undefined){
            return this.context.viewsConfig[this.getId()];
        }
    }


    /**
     * Get component by id
     */
    getComponentById(id) {
        const componentName = id.split(":")[2];
        if(!this.componentsByName[componentName]){
            throw new ComponentNotFoundException('Component with id `'+id+'` not found');
        }
        return this.componentsByName[componentName];
    }

    /**
     * Get component by name
     */
    getComponentByName(name) {
        if(!this.componentsByName[name]){
            throw new Error('Component with name `'+name +'` not found ');
        }
        return this.componentsByName[name];
    }

    // /**
    //  * Set component status for update in next event
    //  * @param component
    //  * @param value
    //  */
    // setComponentStatusUpdate(component, value){
    //     if(this.eventComponentsUpdate[component.getId()] === undefined){
    //         this.eventComponentsUpdate[component.getId()] = {};
    //     }
    //     this.eventComponentsUpdate[component.getId()]['status'] = value;
    // }

    // /**
    //  * Set component state for update in next event
    //  * @param component
    //  * @param state
    //  */
    // setComponentStateUpdate(component, state){
    //     if(this.eventComponentsUpdate[component.getId()] === undefined){
    //         this.eventComponentsUpdate[component.getId()] = {};
    //     }
    //     this.eventComponentsUpdate[component.getId()]['state'] = {};
    //     Object.assign(this.eventComponentsUpdate[component.getId()]['state'], state);
    // }

    // /**
    //  * Set component props for update in next event
    //  * @param component
    //  * @param props
    //  */
    // setComponentPropsUpdate(component, props){
    //     if(this.eventComponentsUpdate[component.getId()] === undefined){
    //         this.eventComponentsUpdate[component.getId()] = {};
    //     }
    //     this.eventComponentsUpdate[component.getId()]['props'] = {};
    //     Object.assign(this.eventComponentsUpdate[component.getId()]['props'], props);
    // }


    /**
     * Mount component to view
     * @param component
     */
    mountComponent(component){
        // console.log("!mountComponent", this.getId(), component.getName());
        // Check if component already registered
        if(this.componentsByName[component.getName()]){
            throw new Error('Component with name `'+ component.getName() + '` already mounted in view `'+this.constructor.name+'`!');
        }

        // Add component to mount state
        this.componentMountStack.push(component.getName());

        // // Set component status update
        // this.setComponentStatusUpdate(component, 'MOUNTED');

        // Add component to register
        this.componentsByName[component.getName()] = component;
    }

    /**
     * Unmount component from view
     * @param component
     */
    unmountComponent(component){
        if(!this.componentsByName[component.getName()]){
            throw new Error('Component with name `'+ component.getName() + '` not registered in view `'+this.constructor.name+'`!');
        }

        // Remove component from mount stack
        const i = this.componentMountStack.indexOf(component.getName());
        this.componentMountStack.splice(i, 1);

        // // Set component status update
        // this.setComponentStatusUpdate(component, 'UNMOUNTED');

        // Remove component from register
        delete this.componentsByName[component.getName()];
    }


    // /**
    //  * Get components update
    //  * @returns {{status: {}, state: {}}|*}
    //  */
    // getEventComponentsUpdate(){
    //     return this.eventComponentsUpdate;
    // }

    // /**
    //  * Reset event components updates
    //  */
    // resetEventComponentsUpdates(){
    //     this.eventComponentsUpdate = {};
    // }

    render(){
        return React.Children.only(this.props.children);
    }

};

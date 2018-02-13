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
        this.components = {};

        // Components by Id
        this.componentsById = [];

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
        // const idParts = id.split(":");
        // const componentName = idParts[2];
        // if(!this.components[componentName]) {
        //     throw new ComponentNotFoundException('Component with id `'+id+'` not found');
        // }
        //
        // // Get index if exists
        // let index = null;
        // if(idParts.length >= 4) {
        //     index = parseInt(idParts[3], 10);
        // }
        //
        // if(!this.components[componentName][index]) {
        //     throw new ComponentNotFoundException('Component with id `'+id+'` not found');
        // }
        // return Number.isInteger(index) ? this.components[componentName][index] : this.components[componentName];
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

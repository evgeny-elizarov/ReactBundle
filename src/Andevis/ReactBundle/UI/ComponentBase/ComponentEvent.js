import React from 'react';
import { ucfirst } from './../Helpers';
import { ComponentDataToJsonString } from "../Helpers/base";
import MsgBox from "@AndevisReactBundle/UI/Components/MsgBox";
import { i18n } from "@AndevisReactBundle/UI/Translation";
import exceptionMessages from "@AndevisReactBundle/UI/Exceptions/messages";
import { eventSubscribers } from '@AndevisReactBundle/UI/Events/EventSubscribers';


// TODO: Event refactor: Заменить первый аргумент на событие.Т.к. событие может возвращать все что угодно и false в том числе.
export default class ComponentEvent {

    constructor(component, eventName, args){
        this.name = eventName;
        this.component = component;
        this.arguments = args;
        this.canceled = false;
        this.promise = this.createPromise();

        // this.isFrontendCompleted = false;
        // this.isBackendCompleted = false;
        // this.preventBackendCall = false;
        // this.onSuccessCallbackStack = [];
        // this.onErrorCallbackStack = [];
        // this.preventDefault = false;
    }

    cancel(){
        this.canceled = true;
    }

    getPromise(){
        return this.promise;
    }

    createPromise(){
        const eventName = this.name;
        const eventComponent = this.component;
        const eventArguments = this.arguments;
        eventArguments.unshift(this.component);
        return new Promise((resolve, reject) => {
            (async () => {
                let eventResult = null;
                /** @var View **/
                const view = eventComponent.getView();

                // ------------------------------------------
                //                  AFTER
                // -------------------------------------------
                //
                // 1.1 Call internal method  event handler
                //

                const internalBeforeUserHandlerName  = 'before' + ucfirst(eventName);
                if (typeof eventComponent[internalBeforeUserHandlerName] === 'function') {
                    // check if canceled
                    if(this.canceled) return;
                    eventResult = await eventComponent[internalBeforeUserHandlerName].apply(eventComponent, eventArguments);
                    if(this.canceled) return;
                }

                //
                // 1.2 Call frontend before user event handler
                //
                // console.log(this.getId(), this.getName(), eventName, "step 1 before");
                const viewBeforeUserHandlerName = eventComponent.getName() + '_before' + ucfirst(eventName);

                if (typeof view[viewBeforeUserHandlerName] === 'function') {

                    // arguments[0] = this;
                    // check if canceled
                    if(this.canceled) return;

                    eventResult = await view[viewBeforeUserHandlerName].apply(view, eventArguments);
                    if(eventResult === false) {
                        //console.log("AA");
                        if(!this.canceled) resolve(eventResult);
                        return false;
                    }
                    // needCallBackend = (ret !== false);
                }

                //
                // 1.3 Call frontend added before event listeners
                //
                if(eventComponent.eventListeners && eventComponent.eventListeners.hasOwnProperty('before' + ucfirst(eventName))) {
                    eventComponent.eventListeners['before' + ucfirst(eventName)].fireArray(eventArguments);
                }


                //
                // 1.4 Call frontend added event subscribers
                //
                eventSubscribers.fireEventArray('before' + ucfirst(eventName), eventArguments);


                // ------------------------------------------
                //                  ON: FRONTEND
                // -------------------------------------------
                //
                // 2.1 Call props user event handler
                //
                // console.log(this.component.getName(), eventName, "step 2 on:frontend");
                const propsUserHandlerName  = 'on' + ucfirst(eventName);
                if (eventComponent.props.hasOwnProperty(propsUserHandlerName)) {

                    // check if canceled
                    if(this.canceled) return;

                    // arguments[0] = this;
                    eventResult = await eventComponent.props[propsUserHandlerName].apply(view, eventArguments);

                    if(this.canceled) return;

                    // needCallBackend = (ret !== false);
                    // If backend return false, skip frontend event callbacks
                    // if(eventResult === false) {
                    //     //console.log("DD");
                    //     if(this.canceled) resolve(eventResult);
                    //     return;
                    // }
                }

                //
                // 2.2 Call internal method  event handler
                //
                const internalUserHandlerName  = 'on' + ucfirst(eventName);
                if (typeof eventComponent[internalUserHandlerName] === 'function') {
                    // check if canceled
                    if(this.canceled) return;
                    eventResult = await eventComponent[internalUserHandlerName].apply(view, eventArguments);

                    if(this.canceled) return;
                }

                //
                // 2.3 Call frontend user event handler
                //
                const viewUserHandlerName = eventComponent.getName() + '_on' + ucfirst(eventName);
                // console.log(this.component.getName(), eventName, "step 2 on:frontend");
                if (typeof view[viewUserHandlerName] === 'function') {
                    // console.log("!!", view, viewUserHandlerName, this.component, this.component.getView(), typeof view[viewUserHandlerName], "aaa");

                    // check if canceled
                    if(this.canceled) return;
                    // arguments[0] = this;
                    eventResult = await view[viewUserHandlerName].apply(view, eventArguments);

                    if(this.canceled) return;
                    // needCallBackend = (ret !== false);
                    // If backend return false, skip frontend event callbacks
                    // if(eventResult === false) {
                    //     //console.log("DD");
                    //     if(!this.canceled) resolve(eventResult);
                    //     return;
                    // }
                }

                //
                // 2.4 Call frontend added event listeners
                //
                if(eventComponent.eventListeners && eventComponent.eventListeners.hasOwnProperty(eventName)) {
                    eventComponent.eventListeners[eventName].fireArray(eventArguments);
                }

                //
                // 2.5 Call frontend added event subscribers
                //
                eventSubscribers.fireEventArray(eventName, eventArguments);

                // ------------------------------------------
                //                  ON: BACKEND
                // -------------------------------------------
                //
                // 3.1 Call backend user event handler (if exists)
                //
                if(eventComponent.allowCallEventBackend(eventName)) {



                    let componentsUpdatedState = {};
                    let componentsUpdatesOrder = [];
                    componentsUpdatesOrder.push(eventComponent.getId());

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
                    for (let i in eventArguments){
                        if(eventArguments.hasOwnProperty(i)){
                            if(i > 0){
                                args.push(eventArguments[i]);
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

                    // check if canceled
                    if(this.canceled) return;

                    // Call backend event resolver
                    let queryResult = null;
                    try {
                        // console.log(this.component.getName(), eventName, "B", queryArgs);
                        // TODO move backend resolveEvent functionality to ComponentEvent class
                        // queryResult = await this.component.backend.resolveEvent(queryArgs);
                        await eventComponent.setAttributes({ backendEventProcessing: true });
                        queryResult = await eventComponent._requestBackend("resolveEvent", queryArgs);
                        await eventComponent.setAttributes({ backendEventProcessing: false });
                        if(queryResult['userError']){
                            MsgBox(queryResult['userError'], MsgBox.Type.OKOnly | MsgBox.Type.Exclamation | MsgBox.Type.SystemModal, i18n(exceptionMessages.userError));
                        }

                    } catch (e) {
                        // console.log("!!!!!!!");
                        await eventComponent.setAttributes({ backendEventProcessing: false });
                        console.error(e.message);
                        if(!this.canceled) reject(e);
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

                            const updateComponent = view.getComponentById(componentUpdate.id);
                            componentsUpdatedState[componentUpdate.id] = updateComponent.prepareStateAfterEvent(newState);
                            if (componentUpdate.id !== eventComponent.getId())
                                componentsUpdatesOrder.push(componentUpdate.id);

                        });
                    }

                    // Update component state by one step
                    for (let i in componentsUpdatesOrder) {
                        const componentId = componentsUpdatesOrder[i];
                        try {
                            const component = view.getComponentById(componentId);
                            if(componentsUpdatedState[componentId]) {
                                // console.log(this.getName(), "fireEvent", eventName, "Update component state", componentId);
                                const componentPrevState = Object.assign({}, component.state);
                                component.componentWillReceiveBackendState(componentsUpdatedState[componentId]);
                                component.setState(componentsUpdatedState[componentId], () => {
                                    component.componentDidReceiveBackendState(componentPrevState);
                                });
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
                        if(!this.canceled) resolve(eventResult);
                        return;
                    }
                }

                // ------------------------------------------
                //                  AFTER
                // -------------------------------------------

                //
                // 4.1 Call internal method  event handler
                //
                const internalAfterUserHandlerName  = 'after' + ucfirst(eventName);
                if (typeof eventComponent[internalAfterUserHandlerName] === 'function') {
                    // check if canceled
                    if(this.canceled) return;
                    eventResult = await eventComponent[internalAfterUserHandlerName].apply(view, eventArguments);
                    if(this.canceled) return;
                }

                //
                // 4.2 Call frontend after user event handler
                //
                // check if canceled
                if(this.canceled) return;

                //console.log(this.getName(), eventName, "step 4 after:frontend");
                const viewAfterUserHandlerName = eventComponent.getName() + '_after' + ucfirst(eventName);
                if (typeof view[viewAfterUserHandlerName] === 'function') {
                    let afterArguments = [eventComponent, eventResult];
                    eventResult = await view[viewAfterUserHandlerName].apply(view, afterArguments);
                    // needCallBackend = (ret !== false);
                    // If backend return false, skip frontend event callbacks
                    if(eventResult === false) {
                        //console.log("EE");
                        if(!this.canceled) resolve(eventResult);
                        return;
                    }
                }


                //
                // 4.3 Call frontend added before event listeners
                //
                if(eventComponent.eventListeners && eventComponent.eventListeners.hasOwnProperty('after' + ucfirst(eventName))) {
                    eventComponent.eventListeners['after' + ucfirst(eventName)].fireArray(eventArguments);
                }

                //
                // 4.4 Call frontend added event subscribers
                //
                eventSubscribers.fireEventArray('after' + ucfirst(eventName), eventArguments);

                // ------------------------------------------
                //                  FINISH
                // -------------------------------------------

                // // Set component attribute event processing
                // newState = {};
                // newState[this.getAttributeStateName('eventProcessing')] = false;
                // await this.setState(newState);

                //console.log(this.getName(), eventName, "eventComplete");
                if(eventResult === false){
                    if(!this.canceled) reject(eventResult);
                } else {
                    if(!this.canceled) resolve(eventResult);
                }


            })();

        });
    }
}

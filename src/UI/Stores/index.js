import AppState from "./AppState";
import { GraphQLClient } from '../GraphQL/index';
import { WindowsStore } from "@AndevisReactBundle/UI/Stores/WindowsStore";


// window.backendState this variable set in AppBundle/Resources/views/app.html.twig
// TODO: refactor initial backend state
let backendState = (window.backendState)? window.backendState : {};
let appState = new AppState(backendState, GraphQLClient);
let windowsStore = new WindowsStore();


export {
    appState,
    windowsStore
}
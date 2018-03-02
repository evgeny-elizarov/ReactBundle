import AppState from "./AppState";
import { MessagePoll } from "./MessagePoll";
import GraphQL from '@AndevisGraphQLBundle/UI/GraphQL';
import { WindowsStore } from "@AndevisReactBundle/UI/Stores/WindowsStore";

let systemMessages = new MessagePoll();

// window.backendState this variable set in AppBundle/Resources/views/app.html.twig
// TODO: refactor initial backend state
let backendState = (window.backendState)? window.backendState : {};
let appState = new AppState(backendState, GraphQL);
let windowsStore = new WindowsStore();


export {
    appState,
    windowsStore,
    systemMessages
}
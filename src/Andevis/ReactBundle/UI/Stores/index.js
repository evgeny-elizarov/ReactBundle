import AppState from "./AppState";
import { MessagePoll } from "./MessagePoll";
import GraphQL from '@AndevisGraphQLBundle/UI/GraphQL';

let systemMessages = new MessagePoll();

// window.backendState this variable set in AppBundle/Resources/views/app.html.twig
// TODO: refactor initial backend state
let backendState = (window.backendState)? window.backendState : {};
let appState = new AppState(backendState, GraphQL);


export {
    appState,
    systemMessages
}
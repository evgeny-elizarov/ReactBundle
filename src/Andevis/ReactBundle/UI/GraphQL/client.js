/**
 * Created by EvgenijE on 07.09.2017.
 */

import ApolloClient from 'react-apollo';
import { createBatchingNetworkInterface } from 'apollo-upload-client'
//import { createNetworkInterface } from 'apollo-upload-client'
import { appState } from './../Stores';
import AppState from "@AndevisReactBundle/UI/Stores/AppState";
//import { CriticalErrorMessage } from "@AndevisReactBundle/Resources/react/helpers/messages";

let basename = (window.location.pathname.startsWith('/app_dev.php')) ? '/app_dev.php/' : '/';
//


const networkInterface = createBatchingNetworkInterface({
    uri: basename + 'graphql',
    batchInterval: 10,
    opts: {
        credentials: 'same-origin' // Add cookie to request
    }
});

// const networkInterface = createNetworkInterface({
//     uri: basename + 'graphql',
//     // batchInterval: 0,
//     opts: {
//         credentials: 'same-origin' // Add cookie to request
//     }
// });


networkInterface.use(
    [
        {
            applyBatchMiddleware(req, next) {
                if (!req.options.headers) {
                    req.options.headers = {};  // Create the header object if needed.
                }
                appState.startPendingRequest();
                next();
            }
        }
    ]
);

networkInterface.useAfter(
    [
        {
            applyBatchAfterware(res, next) {
                appState.requestCompleted();

                // console.log(res);
                // Catch graphQL error
                // TODO: create graphql error logger
                // res.responses.forEach((response) => {
                //     if(response.status === 500)
                //     {
                //         AppState.s
                //     }
                //     if(response.errors){
                //         response.errors.forEach((error) => {
                //             CriticalErrorMessage(error.message, "GraphQL Error");
                //         });
                //     }
                // });
                next();
            }
        }
    ]
);



const GraphQLClient = new ApolloClient({
    networkInterface: networkInterface,
    addTypename: false
});

export default GraphQLClient;

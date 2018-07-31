/**
 * Created by EvgenijE on 07.09.2017.
 */
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BatchHttpLink } from "apollo-link-batch-http";
import { onError } from 'apollo-link-error';
import { eventSubscribers } from '@AndevisReactBundle/UI/Events/EventSubscribers';

const basename = (window.location.pathname.startsWith('/app_dev.php')) ? '/app_dev.php/' : '/';
const uri = basename + 'graphql';


const batchHttpLink = new BatchHttpLink({
    uri: uri,
    credentials: 'same-origin'
});


const middlewareLink = new ApolloLink((operation, forward) => {
    eventSubscribers.fireEventArray('apiOperationBegin', [operation, forward]);

    // Ger operation subscriber
    const result = forward(operation);

    // Subscribe afterware
    result.subscribe((response) => {
        eventSubscribers.fireEventArray('apiOperationComplete', [response]);
    });
    return result;

});

// Call error handlers
const errorLink = onError((options) => {
    eventSubscribers.fireEventArray('apiOperationError', [options]);
});

// use with apollo-client
const link = errorLink.concat(middlewareLink.concat(batchHttpLink));

const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
});

export default client;

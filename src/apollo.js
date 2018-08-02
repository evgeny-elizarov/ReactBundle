import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { ApolloProvider, graphql } from 'react-apollo';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';

export {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    gql,
    ApolloProvider,
    graphql,
    setContext,
    onError
}
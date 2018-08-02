import { gql } from 'react-apollo';
import { CriticalErrorMessage } from "./messages";

/**
 * GraphQL query to get grid data for specified entity
 * @param entityName
 * @param client
 * @param columns
 * @param gridState
 * @param filter
 * @param callback
 */
function entityGridDataQuery(entityName, client, columns, gridState, filter, callback) {
    const limit = gridState.pageInfo.pagesize;
    const offset = gridState.pageInfo.pagesize * gridState.pageInfo.pagenum;
    const sortCol = gridState.sortInfo.sortcolumn;
    const sortDir = (!gridState.sortInfo.sortdirection || gridState.sortInfo.sortdirection.ascending) ? 'ASC' : 'DESC';

    // Order
    let orderBy = {};
    if (sortCol) {
        orderBy[sortCol] = {
            method: 'ALPHANUMERIC',
            direction: sortDir
        };
    }

    const orderByType = entityName.charAt(0).toUpperCase() + entityName.slice(1) + '_OrderBy';
    const filterType = entityName.charAt(0).toUpperCase() + entityName.slice(1) + '_Filter';
    const retColumns = columns.join(',');

    client.query({
        query: gql`
            query list($limit: Int!, $offset: Int, $filters: [${filterType}], $orderBy: ${orderByType} ){
                ${entityName}(limit:$limit, offset:$offset, filters: $filters, orderBy: $orderBy) {
                    ${retColumns}
                },
                ${entityName}Count(filters: $filters)
            }
        `,
        variables: {
            limit: limit,
            offset: offset,
            orderBy: orderBy,
            filters: filter
        },
        fetchPolicy: 'network-only'
    }).then((response) => {
        callback(
            response.data[entityName],
            response.data[entityName + 'Count']
        );
    });
}

/**
 * GraphQL query to get input data for specified entity
 * @param entityName
 * @param client
 * @param filter
 * @param columns
 * @param sortColumns
 * @param callback
 * @param limit
 */
function entityInputAutocompleteDataQuery(entityName, client, filter, columns, callback, sortColumns = [], limit = 10) {
    // Order
    let orderBy = {};
    sortColumns.forEach(function (val) {
        const key = Object.keys(val)[0];
        orderBy[key] = {
            method: 'ALPHANUMERIC',
            direction: val[key],
        };
    });
    const orderByType = entityName.charAt(0).toUpperCase() + entityName.slice(1) + '_OrderBy';
    const filterType = entityName.charAt(0).toUpperCase() + entityName.slice(1) + '_Filter';

    const retColumns = columns.join(',');

    client.query({
        query: gql`
            query list($limit: Int!, $orderBy: ${orderByType}, $filters: [${filterType}] ){
                ${entityName}(limit:$limit, orderBy: $orderBy, filters: $filters) {
                    ${retColumns}
                }
            }
        `,
        variables: {
            limit: limit,
            orderBy: orderBy,
            filters: filter
        }
    }).then((response) => {
        callback(
            response.data[entityName],
        );
    }).catch((errors) => {
        console.error(errors);
    });
}

/**
 * GraphQL query to get dropDown data for specified entity
 * @param entityName
 * @param client
 * @param filter
 * @param columns
 * @param callback
 */
function entityDropDownListDataQuery(entityName, client, filter, columns, callback, sortColumns = [],) {
    // Order
    let orderBy = {};
    sortColumns.forEach(function (val) {
        const key = Object.keys(val)[0];
        orderBy[key] = {
            method: 'ALPHANUMERIC',
            direction: val[key],
        };
    });

    const retColumns = columns.join(',');
    const orderByType = entityName.charAt(0).toUpperCase() + entityName.slice(1) + '_OrderBy';
    const filterType = entityName.charAt(0).toUpperCase() + entityName.slice(1) + '_Filter';

    client.query({
        query: gql`
            query list($orderBy: ${orderByType}, $filters: [${filterType}] ){
                ${entityName}(filters: $filters, orderBy: $orderBy,) {
                  ${retColumns}
                }
            }
        `,
        variables: {
            filters: filter,
            orderBy: orderBy,
        }
    }).then((response) => {
        callback(
            response.data[entityName],
        );
    }).catch((errors) => {
        console.error(errors);
    });
}

function findOneBy(entityName, client, columns, filter, callback) {

    const retColumns = columns.join(',');
    const filterType = entityName.charAt(0).toUpperCase() + entityName.slice(1) + '_Filter';

    client.query({
        query: gql`
            query ($filters: [${filterType}] ){
                ${entityName}(filters: $filters) {
                  ${retColumns}
                }
            }
        `,
        variables: {
            filters: filter
        }
    }).then((response) => {
        callback(
            response.data[entityName][0],//return one data
        );
    }).catch((errors) => {
        console.error(errors);
    });
}

function createNewRecord(entityName, client, entity, callback) {
    const createType = entityName.charAt(0).toUpperCase() + entityName.slice(1) + '_Create';
    client.mutate({
        mutation: gql`
            mutation ($entity: [${createType}] ){
                ${entityName + 'Create'}(entity: $entity) {
                id
                }
            }
        `,
        variables: {
            entity: entity[0]
        }
    }).then((response) => {
        callback(
            response.data[entityName + 'Create'],
        );
    }).catch((errors) => {
        console.error(errors);
    });
}

function updateRecord(entityName, client, entity, callback) {
    const createType = entityName.charAt(0).toUpperCase() + entityName.slice(1) + '_Update';
    client.mutate({
        mutation: gql`
            mutation ($entity: [${createType}] ){
                ${entityName + 'Update'}(entity: $entity) {
                id
                }
            }
        `,
        variables: {
            entity: entity[0]
        }
    }).then((response) => {
        callback(
            response.data[entityName + 'Update'],
        );
    }).catch((errors) => {
        console.error(errors);
    });
}

export {
    entityGridDataQuery,
    entityInputAutocompleteDataQuery,
    entityDropDownListDataQuery,
    findOneBy,
    createNewRecord,
    updateRecord
}
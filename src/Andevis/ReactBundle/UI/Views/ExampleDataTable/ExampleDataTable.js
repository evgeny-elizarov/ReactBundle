import React from 'react';
import { View, DataTable } from "@AndevisReactBundle/UI/Components";

export default class ExampleDataTable extends View {

    getBundleName() {
        return 'React';
    }

    render() {
        return (
            <DataTable
                name="tableTest"
                columns={[{
                    Header: 'Name',
                    accessor: 'name' // String-based value accessors!
                }, {
                    Header: 'Age',
                    accessor: 'age',
                    Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
                }, {
                    id: 'friendName', // Required because our accessor is not a string
                    Header: 'Friend Name',
                    accessor: d => d.friend.name // Custom value accessors!
                }, {
                    Header: props => <span>Friend Age</span>, // Custom header components!
                    accessor: 'friend.age'
                }]}
            />
        )
    }
}
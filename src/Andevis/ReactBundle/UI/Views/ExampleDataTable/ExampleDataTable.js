import React from 'react';
import { View, DataTable } from "@AndevisReactBundle/UI/Components";


export default class ExampleDataTable extends View {

    getBundleName() {
        return 'React';
    }

    generateData(pageIndex, pageSize, totalDataCount) {
        let data = [];
        for (let i = pageIndex; i < pageIndex + pageSize && i < totalDataCount; i++) {
            let id = i + 1;
            data.push({
                id: id,
                name: 'Tanner Linsley ' + id,
                age: totalDataCount - id,
                friend: {
                    name: 'Jason Maurer',
                    age: 23,
                }
            });
        }
        return data;
    }

    componentDidMount() {
        super.componentDidMount();
    }

    tableTest_onDidMount(table) {
        table.pages = 1000 / table.pageSize;
    }

    tableTest_onFetchData(table, pageSize, pageIndex, sorted, filtered) {
        return this.generateData(pageIndex * pageSize, pageSize, 1000);
    }

    render() {
        return (
            <div>
                <h3>Client side example</h3>
                <DataTable
                    name="tableTest"
                    defaultPageSize={5}
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
                <h3>Server side example</h3>
                <DataTable
                    name="tableTest2"
                    defaultPageSize={5}
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
            </div>

        )
    }
}
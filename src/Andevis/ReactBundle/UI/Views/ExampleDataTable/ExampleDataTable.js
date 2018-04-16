import React from 'react';
import { View, DataTable, Button } from "@AndevisReactBundle/UI/Components";
import ExampleBaseView from "@AndevisReactBundle/UI/Views/ExampleBaseView";


export default class ExampleDataTable extends ExampleBaseView {

    getBundleName() {
        return 'React';
    }

    getInitialState(){
        return {
            clientData: [],
            serverData: []
        }
    }

    /**
     * Генерируем данные на клиенте
     * @param pageIndex
     * @param pageSize
     * @param totalDataCount
     * @return {Array}
     */
    generateData(totalDataCount) {
        let data = [];
        for (let i = 0; i < totalDataCount; i++) {
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

    /**
     * Генерируем постраничные данные
     * @param pageIndex
     * @param pageSize
     * @param totalDataCount
     * @return {Array}
     */
    generatePagedData(pageIndex, pageSize, totalDataCount) {
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

    /**
     * При монтировении компонетна dataClient генерируем для него данные
     * @param table
     */
    dataClient_onDidMount(table) {
        this.setState({ clientData: this.generateData(1000) });
    }

    /**
     * Вычисляем кол-во страниц
     * @param dataTable
     */
    dataClient2_onDidMount(dataTable){
        this.callServerMethod('loadServerData').then((data) => {
            this.setState({
                serverData: data
            })
        });
    }

    /**
     * Перезагружем данные для
     */
    btnRealoadDataClient2_onClick(){
        this.callServerMethod('loadServerData').then((data) => {
            this.setState({
                serverData: data
            })
        });
    }

    /**
     * При монтировании компонента dataClient2 загружаем данные с сервера
     * @param dataTable
     */
    dataClient2_onFetchData(dataTable, pageSize, pageIndex, sorted, filtered) {
        if(sorted.length > 0) alert('TODO: Custom sorting on client');
        dataTable.pages = 1000 / dataTable.pageSize;
        return this.generatePagedData(pageIndex, pageSize, 1000);
    }

    render() {
        return (
            <div>
                <h3>Client side example (data on client)</h3>
                <DataTable
                    name="dataClient"
                    defaultPageSize={5}
                    data={this.state.clientData}
                    sortable={true}
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
                <h3>Client side example (All data from server)</h3>
                <DataTable
                    name="dataClient2"
                    defaultPageSize={5}
                    data={this.state.serverData}
                    sortable={true}
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
                <Button name="btnRealoadDataClient2" title="Reload" />
                <h3>Server side example</h3>
                <DataTable
                    name="dataServer"
                    sortable={true}
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
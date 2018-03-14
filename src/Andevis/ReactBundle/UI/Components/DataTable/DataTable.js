import React from 'react';
import Component from "@AndevisReactBundle/UI/ComponentBase/Component";
import { autobind } from "@AndevisReactBundle/decorators";
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default class DataTable extends Component{

    getBundleName(){
        return 'React';
    }

    eventList(){
        return super.eventList().concat(['fetchData']);
    }

    getInitialState(){
        return {
            data: [],
        }
    }

    // Attribute: isProcessing
    get isLoading() {
        return this.getAttributeValue('isLoading', false);
    }
    set isLoading(value) {
        this.setAttributeValue('isLoading', value);
    }

    // Attribute: pages
    get pages() {
        return this.getAttributeValue('pages', null);
    }
    set pages(value) {
        this.setAttributeValue('pages', value);
    }

    /**
     * Fetch data
     * @param pageSize
     * @param page
     * @param sorted
     * @param filtered
     */
    fetchData(pageSize, page, sorted, filtered){
        if(!isNaN(page)) {
            // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
            // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
            this.isLoading = true;
            this.fireEvent('fetchData', pageSize, page, sorted, filtered)
                .then((data) => {
                    if(!data){
                        data = [];
                    }
                    let newState = {
                        data: data
                    };
                    newState[this.getAttributeStateName('isLoading')] = false;

                    // Change state by one step
                    this.setState(newState);
                });
        }
    }

    @autobind
    handleFetchData(state, instance){
        this.fetchData(
            state.pageSize,
            state.page,
            state.sorted,
            state.filtered
        );
    }

    render(){
        let { name, ...tableProps } = this.props;
        return (
            <ReactTable
                {...tableProps}
                onFetchData={this.handleFetchData} // Request new data when things change
                loading={this.isLoading} // Display the loading overlay when we need it
                manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                data={this.state.data}
                pages={this.pages} // Display the total number of pages
            />
        )
    }
}

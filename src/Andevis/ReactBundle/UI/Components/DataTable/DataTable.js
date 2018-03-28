import React from 'react';
import Component from "@AndevisReactBundle/UI/ComponentBase/Component";
import PropTypes from "@AndevisReactBundle/prop-types";
import { autobind } from "@AndevisReactBundle/decorators";
import ReactTable from 'react-table';
import messages from './messages';
import 'react-table/react-table.css';
import { i18n } from "@AndevisReactBundle/UI/Translation";
import { filterObjectByKeys } from "@AndevisReactBundle/UI/Helpers";

export default class DataTable extends Component{

    static propTypes = Object.assign({}, Component.propTypes, {
        defaultPageSize: PropTypes.number,
        sortable: PropTypes.bool,
    });

    static defaultProps = Object.assign({}, Component.defaultProps, {
        defaultPageSize: 25,
        sortable: false
    });

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

    // Attribute: pagesSize
    get pageSize() {
        return this.getAttributeValue('pageSize', this.props.defaultPageSize);
    }
    set pageSize(value) {
        this.setAttributeValue('pageSize', value);
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
        this.setAttributes({
            'pageSize': state.pageSize
        }, () => {
            this.fetchData(
                state.pageSize,
                state.page,
                state.sorted,
                state.filtered
            );
        });
    }

    render(){
        // https://react-table.js.org/#/story/readme
        let tableProps = filterObjectByKeys(this.props, [
            'columns',
            'showPagination',
            'showPaginationTop',
            'showPaginationBottom',
            'showPageSizeOptions',
            'pageSizeOptions',
            'defaultPageSize',
            'showPageJump',
            'collapseOnSortingChange',
            'collapseOnPageChange',
            'collapseOnDataChange',
            'freezeWhenExpanded',
            'sortable',
            'multiSort',
            'resizable',
            'filterable',
            'defaultSortDesc',
            'defaultSorted',
            'defaultFiltered',
            'defaultResized',
            'defaultExpanded'
        ]);

        console.log("render", this.props);
        return (
            <ReactTable
                ref={(table) => {
                    this.table = table;
                }}
                {...tableProps}
                // Forces table not to paginate or sort automatically, so we can handle it server-side
                manual
                onFetchData={this.handleFetchData} // Request new data when things change
                loading={this.isLoading} // Display the loading overlay when we need it
                data={this.state.data}
                pages={this.pages} // Display the total number of pages

                // Text
                previousText={i18n(messages.previousText)}
                nextText={i18n(messages.nextText)}
                loadingText={i18n(messages.loadingText)}
                noDataText={i18n(messages.noDataText)}
                pageText={i18n(messages.pageText)}
                ofText={i18n(messages.ofText)}
                rowsText={i18n(messages.rowsText)}
            />
        )
    }
}

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
        data: PropTypes.any,
        defaultPageSize: PropTypes.number,
        filtered: PropTypes.array,
        sortable: PropTypes.bool,
        loading: PropTypes.bool
    });

    static defaultProps = Object.assign({}, Component.defaultProps, {
        data: -1, // Fix for detect controlled mode
        defaultPageSize: 25,
        sortable: false,
        loading: false,
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

    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);
        if(nextProps.hasOwnProperty('data') && this.props.data !== nextProps.data) {
            this.setState({
                data: nextProps.data
            });
        }
    }

    // Attribute: isProcessing
    get isLoading() {
        return this.getAttributeValue('isLoading', false);
    }
    set isLoading(value) {
        this.setAttributeValue('isLoading', value);
    }

    // Attribute: pageIndex
    get pageIndex() {
        return this.getAttributeValue('pageIndex', 0);
    }
    set pageIndex(value) {
        this.setAttributeValue('pageIndex', value);
    }

    // Attribute: pages
    get pages() {
        return this.getAttributeValue('pages', 1);
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
     * Set data
     * @param data
     */
    setData(data){
        this.setState({
            data: data
        });
    }

    /**
     * Get data
     */
    getData(){
        return this.state.data;
    }

    /**
     * Fetch data
     * @param pageSize
     * @param pageIndex
     * @param sorted
     * @param filtered
     */
    fetchData(pageSize = null, pageIndex = 0, sorted, filtered){
        if(pageSize === null)
            pageSize = this.pageSize;

        if(isNaN(pageIndex)) {
            throw new Error('pageIndex is null!');
        }
        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        this.isLoading = true;
        return this.fireEvent('fetchData', pageSize, pageIndex, sorted, filtered)
            .then((data) => {
                if(!data) data = [];

                if(!data){
                    data = [];
                }
                let newState = {
                    data: data
                };
                newState[this.getAttributeStateName('isLoading')] = false;
                newState[this.getAttributeStateName('pageSize')] = pageSize;

                // Change state by one step
                this.setState(newState);
            });
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

    @autobind
    handlePageChange(pageIndex){
        this.setAttributes({ pageIndex: pageIndex }).then(() => {
            if(this.props.onPageChange) this.props.onPageChange(pageIndex);
        })
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
            'pageSize',
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
            'defaultExpanded',
            // 'onPageChange',
            'onPageSizeChange',
            'onSortedChange',
            'onFilteredChange',
            'onResizedChange',
            'onExpandedChange'
        ]);

        if(this.props.data === -1){
            tableProps.manual = true;
            tableProps.onFetchData = this.handleFetchData;
            tableProps.loading = this.isLoading;
            tableProps.pages = this.pages;
            tableProps.loading = this.isLoading;
        } else {
            tableProps.loading = this.props.loading;
        }

        return (
            <ReactTable
                ref={(table) => {
                    this.table = table;
                }}
                {...tableProps}
                // Forces table not to paginate or sort automatically, so we can handle it server-side
                // manual
                // onFetchData={this.handleFetchData} // Request new data when things change
                // loading={this.isLoading} // Display the loading overlay when we need it
                data={this.state.data || []}
                // pages={this.pages} // Display the total number of pages

                // Text
                previousText={i18n(messages.previousText)}
                nextText={i18n(messages.nextText)}
                loadingText={i18n(messages.loadingText)}
                noDataText={i18n(messages.noDataText)}
                pageText={i18n(messages.pageText)}
                ofText={i18n(messages.ofText)}
                rowsText={i18n(messages.rowsText)}

                // Fully controlled
                filtered={this.props.filtered}

                page={this.pageIndex}
                onPageChange={this.handlePageChange}
            />
        )
    }
}

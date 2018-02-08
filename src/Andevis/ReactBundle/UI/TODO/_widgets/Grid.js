import React, { Component } from 'react';
import JqxGrid from './../../vendors/jqwidgets-react/react_jqxgrid';
import PropTypes from 'prop-types';

const $ = window.$;

export default class Grid extends React.Component {

    static propTypes = {
        width: PropTypes.any,
        height: PropTypes.any,
        theme: PropTypes.string,
        autoheight: PropTypes.bool,
        enabletooltips: PropTypes.bool,
        editable: PropTypes.bool,
        style: PropTypes.object,
        pageable: PropTypes.bool,
        sortable: PropTypes.bool,
        loadData: PropTypes.func.isRequired,
        datafields: PropTypes.array.isRequired,
        columns: PropTypes.array.isRequired,
        filter: PropTypes.func
    };

    static defaultProps = {
        pageable: true,
        sortable: true,
        autoheight: true,
        enabletooltips: true,
        editable: false,
        theme: 'bootstrap'
    };

    static contextTypes = {
        client: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.source = {
            localdata: [],
            id: 'id',
            datatype: "json",
            datafields: this.props.datafields,
            totalrecords: 0,
        };

        this.dataAdapter = new $.jqx.dataAdapter(this.source);
    }

    getJqxGrid(){
        return this.refs.Grid;
    }

    loadData(callback){
        const sortInfo = this.refs.Grid.getsortinformation();
        const pageInfo = this.refs.Grid.getpaginginformation();
        const columns = this.props.datafields.map((col) => col.name);
        let filter = (this.props.filter) ? this.props.filter() : [];

        this.props.loadData(
            this.context.client,
            columns,
            {
                pageInfo: pageInfo,
                sortInfo: sortInfo
            },
            filter,
            (records, totalCount) => {
                this.source.totalrecords = totalCount;
                this.source.localdata = records;
                this.refs.Grid.updatebounddata();
                if(callback) callback(records);
            }
        );
    }

    componentDidMount() {
        this.refs.Grid.on('sort', (event) => {
            this.loadData();
        });
        this.refs.Grid.on('pagechanged', (event) => {
            this.loadData();
        });
        this.loadData();
    }

    onPagingInfoChange(pageInfo){
        this.setState({
            pageSize: pageInfo.pagesize,
            offset: pageInfo.pagesize * pageInfo.pagenum
        });
    }

    renderGridRows() {
        return this.dataAdapter.records;
    }

    render() {
        return (
            <JqxGrid
                ref='Grid'
                style={this.props.style}
                theme={this.props.theme}
                width={this.props.width}
                height={this.props.height}
                enabletooltips={this.props.enabletooltips}
                autoheight={this.props.autoheight}
                virtualmode={true}
                rendergridrows={this.renderGridRows.bind(this)}
                source={this.dataAdapter}
                columns={this.props.columns}
                pageable={this.props.pageable}
                sortable={this.props.sortable}
                onPagingInfoChange={this.onPagingInfoChange.bind(this)}
                // altrows={true}
                // enabletooltips={true}
                // editable={false}
            />
        )
    }
}

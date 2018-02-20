import Component from "@AndevisReactBundle/UI/ComponentBase/Component";
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import React from 'react';
import JqxGrid from "../../Vendors/jqwidgets-react/react_jqxgrid";
const $ = window.$;

export default class Grid extends Component {

    static propTypes = Object.assign({}, Component.propTypes, {
        columns: PropTypes.array.isRequired,
        pageSize: PropTypes.number,
        pageSizeOptions: PropTypes.array,
        width: PropTypes.string.isRequired,
        height: PropTypes.string,
        pageable: PropTypes.bool.isRequired
    });

    static defaultProps = {
        pageSize: 20,
        pageSizeOptions: [20, 50, 100],
        width: "100%",
        pageable: true
    };

    getBundleName() {
        return 'React';
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            records: [],
            recordsTotal: 0,
            pagenum: 0,
            pagesize: this.props.pageSize,
            recordendindex: 10,
            recordstartindex: 0,
        };
    }

    eventList() {
        return ['loadData']
    }

    loadData(){
        this.refs.Grid.updatebounddata();
    }

    @autobind
    jqxDataAdapterLoad(serverData, source, callback) {
        this.setState(serverData, () => {
            (async () => {
                await this.fireEvent('loadData');
                // console.log("jqxDataAdapterLoad", this.state);
                if (callback)
                    callback({
                        records: this.state.records,
                        totalrecords: this.state.recordstotal
                    });
            })();
        });
    }

    getRowData(rowIndex){
        return this.refs.Grid.getrowdata(rowIndex);
    }

    shouldComponentUpdate(nextProps, nextStates) {
        return false; //this.props.hidden !== nextProps.hidden;
    }

    // componentDidMount(){
    //     super.componentDidMount();
    //     console.log(this);
    // }

    // /**
    //  * Load data
    //  */
    // loadData() {
    //     this.refs.Grid.updatebounddata();
    // }

    // /**
    //  * Refresh
    //  */
    // refresh() {
    //     this.refs.Grid.refresh();
    // }
    /**
     *
     * @param records
     * @param recordsTotal
     */
    setRecords(records, recordsTotal){
        this.setState({
            records: records,
            recordstotal: recordsTotal
        });
    }

    render() {
        const grid = this;
        // Create jqx data adapter
        const jqxDataAdapter = new $.jqx.dataAdapter({
                // Fake url address to emulate remote loading
                url: '//graphql',
                datatype: 'json',
                sort: function()
                {
                    grid.refs.Grid.updatebounddata();
                }
            },
            {
                loadServerData: this.jqxDataAdapterLoad
            }
        );

        // Prepare jqxGrid properties to lowercase
        let props = Object.assign({}, this.props, {
            virtualmode: true,
            source: jqxDataAdapter,
            rendergridrows: (params) => {
                return jqxDataAdapter.records;
            }
        });
        for (let key in props) {
            if (props.hasOwnProperty(key)) {
                let lowKey = key.toLowerCase();
                if (lowKey !== key) {
                    props[lowKey] = props[key];
                    delete props[key];
                }
            }
        }

        return (
            <JqxGrid ref='Grid' {...props} />
        )
    }
}
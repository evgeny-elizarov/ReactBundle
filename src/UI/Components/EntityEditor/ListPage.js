import React from '@AndevisReactBundle/react';
import PropTypes from "@AndevisReactBundle/prop-types";
import { Button, Page } from "@AndevisReactBundle/UI/Components";
import DataTable from "@AndevisReactBundle/UI/Components/DataTable/DataTable";
import messages from './messages';
import {i18n} from "@AndevisReactBundle/UI/Translation/index";
import './EntityEditor.scss';

/**
 * List page
 */
export default class ListPage extends React.Component {

    static propTypes = {
        rootPath: PropTypes.string,
        title: PropTypes.string,
        columns: PropTypes.array,
    };

    static contextTypes = {
        entityEditor: PropTypes.object.isRequired
    };

    constructor(props, context){
        super(props, context);
        this.state = {
            loading: false,
            data: []
        };
    }

    loadListData(){
        this.setState({
            loading: true
        }, () => {
            this.context.entityEditor.loadEntityList().then((data) => {
                this.setState({
                    data: data,
                    loading: false
                });
            });
        })
    }


    componentDidMount(){
        this.loadListData();
    }

    render() {
        const columns = this.props.columns.concat(
            [
                this.context.entityEditor.getListActionsColumn()
            ]
        );

        return (
            <Page.Layout
                title={this.props.title}
                toolbar={
                    <div>
                        <div className="btn-group" role="group">
                            <Button
                                name="btnCreateNewRecord"
                                onClick={() => {
                                    this.context.entityEditor.showAddPage();
                                }}
                                className="btn-success btn-sm">{i18n(messages.createNew)}</Button>
                        </div>
                    </div>
                }>
                <div className="entityEditor-component dataTables_wrapper">
                    <div className="dataTables_filter">
                        {this.context.entityEditor.renderListPageFilter(this.props)}
                    </div>
                    <DataTable
                        name="dataTable"
                        sortable={true}
                        filterable
                        data={this.state.data}
                        loading={this.state.loading}
                        columns={columns}
                        defaultPageSize={15}
                        className="-striped -highlight"
                    />
                </div>
            </Page.Layout>
        )
    }
}
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import View from "@AndevisReactBundle/UI/Components/View/View";
import Grid from "@AndevisReactBundle/UI/Components/Grid/Grid";
const $ = window.$;

export default class ExampleGrid extends View {

    getBundleName(){
        return 'React';
    }

    componentDidMount(){

        // Bind onClick for grid row buttons
        $(ReactDOM.findDOMNode(this)).on('click', 'button.btn-edit', (e) => {
            alert(JSON.stringify(this.refs.gridExample.getRowData($(e.target).data('row'))));
        });
    }

    render(){
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Grid example</h1>
                </div>
                <Grid
                    ref="gridExample"
                    name="gridExample"
                    autoheight={true}
                    sortable={true}
                    columns={[
                        { text: 'ID', datafield: 'id' },
                        { text: 'Permission', datafield: 'permission' },
                        {
                            text: 'Actions',
                            width: '150px',
                            cellsrenderer: (row) => {
                                return ReactDOMServer.renderToString(
                                    <button className="btn-edit btn btn-sm" data-row={row}>Edit</button>
                                );
                            }
                        }
                    ]}
                />
            </div>
        )
    }
}
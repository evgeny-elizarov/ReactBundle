import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JqxDropDownList from "./../../vendors/jqwidgets-react/react_jqxdropdownlist";
import { filterObjectByKeys } from "../../Helpers/base";

const $ = window.$;

export default class DropDownList extends React.Component {

    static propTypes = {
        ref: PropTypes.any,
        theme: PropTypes.string,
        width: PropTypes.any,
        height: PropTypes.any,
        loadData: PropTypes.func.isRequired,
        filter: PropTypes.func.isRequired,
        displayMember: PropTypes.func,
        disabled: PropTypes.any,
        id: PropTypes.any
    };

    static defaultProps = {
        theme: 'bootstrap',
        disabled: false,
    };

    static contextTypes = {
        client: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.source = {
            localdata: [],
            id: this.props.id,
            datatype: "json"
        };
        this.dataAdapter = new $.jqx.dataAdapter(this.source);
    }

    componentDidMount() {
        this.refs.DropDownList.on('open', (event) => {
            let filter = this.props.filter();
            this.props.loadData(this.context.client, filter, (data) => {
                    this.source.localdata = data;
                    this.dataAdapter.dataBind();
                }
            );
        });
        this.refs.DropDownList.on('select', (event) => {
            if (this.refs.DropDownList.getSelectedItem() !== null) {
                this.props.onChange(this.refs.DropDownList.getSelectedItem().originalItem.uid);
            }
        });

    }

    /**
     * Change editable status
     * @param status
     */
    changeEditableStatus(status) {
        $(this.refs.DropDownList.componentSelector).jqxDropDownList({ disabled: !status });
    }

    getJqxDropDownList() {
        return this.refs.DropDownList;
    }

    /**
     * Render
     * @returns {XML}
     */
    render() {
        const JqxProps = filterObjectByKeys(this.props, [
            'theme',
            'width',
            'height',
            'disabled',
        ]);
        return (
            <div>
                <JqxDropDownList
                    ref="DropDownList"
                    source={this.dataAdapter}
                    displayMember={this.props.displayMember}
                    {...JqxProps}
                />
            </div>
        )
    }
}

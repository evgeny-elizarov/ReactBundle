import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JqxInput from "./../../vendors/jqwidgets-react/react_jqxinput";

const $ = window.$;

export default class InputAutocomplete extends React.Component {

    static propTypes = {
        width: PropTypes.any,
        height: PropTypes.any,
        minLength: PropTypes.any,
        placeHolder: PropTypes.any,
        display: PropTypes.func, // TODO функция для мапинга
        loadData: PropTypes.func.isRequired,
        datafields: PropTypes.array.isRequired,
        filter: PropTypes.func.isRequired
    };

    static contextTypes = {
        client: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.source = {
            localdata: [],
            datatype: "json",
            datafields: this.props.datafields,
        };
        this.dataAdapter = new $.jqx.dataAdapter(this.source);

        this.source = (query, response) => {
            let filter = this.props.filter(query);
            this.props.loadData(this.context.client, filter, (data) => {
                    response(this.props.display(data));
                }
            )
        };
    }

    componentDidMount() {
        this.refs.inputAutocomplite.on('change', (event) => {
            if (event.args) {
                this.props.onSelect(event.args.item);
            }
        });
    }

    render() {
        return (
            <JqxInput
                ref={"inputAutocomplite"}
                width={this.props.width}
                height={this.props.height}
                minLength={this.props.minLength}
                placeHolder={this.props.placeHolder}
                source={this.source}
            />
        )
    }
}

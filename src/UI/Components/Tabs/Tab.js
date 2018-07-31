import React from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import { Tab as ReactTab } from 'react-tabs';
import { Component } from "@AndevisReactBundle/UI/ComponentBase";
import hotKeys from "@AndevisReactBundle/hotkeys";
import { autobind } from "@AndevisReactBundle/decorators";

export default class Tab extends ReactTab {

    static propTypes = Object.assign({}, ReactTab.propTypes, {
        hotKey: PropTypes.string
    });

    static contextTypes = Object.assign({}, ReactTab.contextTypes, {
        tabs: PropTypes.object.isRequired
    });

    hotKeySubsIndex = null;

    componentDidMount(){
        super.componentDidMount();
        // Register hot keys
        if(this.props.hotKey){
            this.hotKeySubsIndex = hotKeys.registerHotKey(this.props.hotKey, this.handleTabSelection);
        }
    }

    componentWillUnmount(){
        // super.componentWillUnmount();
        hotKeys.unregisterHotKey(this.hotKeySubsIndex);
    }

    /**
     * Get tab index
     * @return {number}
     */
    getTabIndex(){
        // Find tab index
        let tabDomNode = ReactDOM.findDOMNode(this);
        var index = 0;
        while ( (tabDomNode = tabDomNode.previousElementSibling) ) {
            index++;
        }
        return index;
    }

    checkFocus() {
        if (this.props.selected && this.props.focus) {
            if(this.node) this.node.focus();
        }
    };

    @autobind
    handleTabSelection(){
        this.context.tabs.selectTab(this.getTabIndex());
    }

    render(){
        const {hotKey, ...tabProps} = this.props;
        return (
            <ReactTab {...tabProps} />
        )
    }
}

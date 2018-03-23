import React from "react";
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs';
import Component from "@AndevisReactBundle/UI/ComponentBase/Component";
import PropTypes from "@AndevisReactBundle/prop-types";
import { autobind } from "@AndevisReactBundle/decorators";
import {filterObjectByKeys} from "@AndevisReactBundle/UI/Helpers";

export default class Tabs extends Component {

    static propTypes = Object.assign({}, Component.propTypes, {
        onSelect: PropTypes.func,
    });

    getBundleName(){
        return 'React';
    }

    // Attribute: selectedTabIndex
    get selectedTabIndex() {
        return this.getAttributeValue('selectedTabIndex', this.getSelectedTabIndexFromUrl());
    }
    set selectedTabIndex(value) {
        this.setAttributeValue('selectedTabIndex', value);
    }

    eventList(){
        return super.eventList().concat(['selectTab']);
    }

    selectTab(index){
        if(this.selectedTabIndex !== index)
            this.selectedTabIndex = index;
        return this.fireEvent('selectTab', index);
    }

    /**
     * Parse url hash
     * @returns {{}}
     */
    parseUrlHash()
    {
        let tabs = {};
        const re = /((\w+):(\d));?/g;
        let m;
        while (m = re.exec(window.location.hash.substr(1))) {
            tabs[m[2]] = parseInt(m[3]);
        }
        return tabs;
    }

    /**
     * Prepare url hash
     * @param selectedIndex
     * @returns {string}
     */
    prepareUrlHash(selectedIndex){
        let tabs = this.parseUrlHash();
        tabs[this.getName()] = selectedIndex;
        return Object.keys(tabs).map(key => key + ":" + tabs[key]).join(";");
    }

    /**
     * Get selected tab index from url
     * @returns {*}
     */
    getSelectedTabIndexFromUrl(){
        const hashTabs = this.parseUrlHash();
        if(hashTabs.hasOwnProperty(this.getName())){
            return hashTabs[this.getName()];
        }
        return 0;
    }

    @autobind
    handleSelectTab(index){
        this.selectTab(index);
        window.history.pushState(null, null, "#"+this.prepareUrlHash(index));
    }

    render(){
        const tabProps = Object.assign({
            defaultIndex: this.selectedTabIndex,
            onSelect: this.handleSelectTab
        }, filterObjectByKeys(this.props, [
            'className',
            'defaultFocus',
            'defaultIndex',
            'disabledTabClassName',
            'domRef',
            'forceRenderTabPanel',
            'onSelect',
            'selectedIndex',
            'selectedTabClassName',
            'selectedTabPanelClassName'
        ]));

        return (
            <ReactTabs {...tabProps}>{this.props.children}</ReactTabs>
        )
    }
}

export {
    Tabs,
    Tab,
    TabList,
    TabPanel
}
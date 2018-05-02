import React from "react";
import shorthash from 'shorthash';
import { Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs';
import Tab from './Tab';
import Component from "@AndevisReactBundle/UI/ComponentBase/Component";
import PropTypes from "@AndevisReactBundle/prop-types";
import { autobind } from "@AndevisReactBundle/decorators";
import {filterObjectByKeys} from "@AndevisReactBundle/UI/Helpers";


export default class Tabs extends Component {

    static propTypes = Object.assign({}, Component.propTypes, {
        onSelect: PropTypes.func,
        defaultIndex: PropTypes.number,
        forceRenderTabPanel: PropTypes.bool
    });

    static defaultProps = Object.assign({}, Component.defaultProps, {
        defaultIndex: 0,
        forceRenderTabPanel: true
    });

    static childContextTypes = Object.assign({}, Component.childContextTypes, {
        tabs: PropTypes.object,
    });

    getChildContext(){
        return {
            tabs: this
        }
    }

    static bundleName = 'React';

    getInitialState(){
        return {
            tabIndex: this.props.defaultIndex
        }
    }

    // Attribute: selectedTabIndex
    get selectedTabIndex() {
        return this.getAttributeValue('selectedTabIndex', this.props.defaultIndex);
    }
    set selectedTabIndex(value) {
        this.setAttributeValue('selectedTabIndex', value);
    }

    componentDidMount(){
        super.componentDidMount();
        const tabIndex = this.getSelectedTabIndexFromUrl();
        if(tabIndex) {
            this.setAttributes({
                selectedTabIndex: tabIndex
            });
            // });.then(() => {
            //     super.componentDidMount();
            // });

        }
        // else {
        //     super.componentDidMount();
        // }
    }

    eventList(){
        return super.eventList().concat(['selectTab']);
    }

    /**
     * Select tab event
     * @param index
     * @return {Promise}
     */
    selectTab(index){
        window.history.pushState(null, null, "#"+this.prepareUrlHash(index));
        this.setAttributeValue('selectedTabIndex', index);
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
     * Get tab url hash
     *
     * @param globalTabsName  ViewBundleName:ViewName:TabsName
     * @param tabIndex
     * @returns {string}
     */
    static getTabUrlHashLink(globalTabsName, tabIndex){
        return shorthash.unique(globalTabsName) + ":" + tabIndex;
    }

    /**
     * Get hashed tabs global name
     * @returns {*}
     */
    getHashedTabsGlobalName(){
        return shorthash.unique(this.getView().constructor.getBundleName()+":"+this.getView().getName()+":"+this.getName());
    }


    /**
     * Prepare url hash
     * @param selectedIndex
     * @returns {string}
     */
    prepareUrlHash(selectedIndex){
        let tabs = this.parseUrlHash();
        tabs[this.getHashedTabsGlobalName()] = selectedIndex;
        return Object.keys(tabs).map(key => key + ":" + tabs[key]).join(";");
    }

    /**
     * Get selected tab index from url
     * @returns {*}
     */
    getSelectedTabIndexFromUrl(){
        const hashTabs = this.parseUrlHash();
        if(hashTabs.hasOwnProperty(this.getHashedTabsGlobalName())){
            return hashTabs[this.getHashedTabsGlobalName()];
        }
    }

    @autobind
    handleSelectTab(index){
        this.selectTab(index);
        if(this.props.onSelect)
            this.props.onSelect(index);
    }

    render(){
        const tabProps = Object.assign({
            // defaultIndex: this.getSelectedTabIndexFromUrl(),
        }, filterObjectByKeys(this.props, [
            'className',
            'defaultFocus',
            'disabledTabClassName',
            'domRef',
            'forceRenderTabPanel',
            'selectedTabClassName',
            'selectedTabPanelClassName',
            // 'defaultIndex'
            // 'selectedIndex',
        ]), {
            onSelect: this.handleSelectTab,
            selectedIndex: this.selectedTabIndex,
        });
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
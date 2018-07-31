import React from "@AndevisReactBundle/react";
import PropTypes from "@AndevisReactBundle/prop-types";
import View from "@AndevisReactBundle/UI/Components/View/View";
import { i18n } from "@AndevisReactBundle/UI/Translation";
import messages from './messages';
import PageLayout from './PageLayout';
import ErrorPageNotFound from './Errors/ErrorPageNotFound';
import ErrorAccessForbidden from './Errors/ErrorAccessForbidden';
import './Page.scss';

export default class Page extends View {

    static propTypes = Object.assign({}, View.propTypes, {
        title: PropTypes.string,
        toolbar: PropTypes.any
    });

    // Shortcut to PageLayout
    static Layout = PageLayout;


    getInitialState(){
        return Object.assign({}, super.getInitialState(), {
            showTechnicalInfo: false
        });
    }

    getView() {
        if (this instanceof Page) return this;
        return super.getView();
    }

    /**
     * Attribute: title
     * @returns {*}
     */
    get title() {
        return this.getAttributeValue('title', this.props.title);
    }

    set title(value) {
        this.setAttributeValue('title', value);
    }

    /**
     * Render error access denied
     * @return {*}
     */
    static renderErrorAccessDenied(component) {
        return (
            <Page.Layout title={i18n(messages.accessDenied)} className={"error-page"}>
                <ErrorAccessForbidden component={component}/>
            </Page.Layout>
        )
    }

    /**
     * Render error page not found
     * @return {*}
     */
    static renderErrorPageNotFound(){
        return (
            <Page.Layout title={i18n(messages.pageNotFound)} className={"error-page"}>
                <ErrorPageNotFound />
            </Page.Layout>
        )
    }

    /**
     * Page render
     * @return {*}
     */
    render(){
        return (
            <Page.Layout title={this.title} toolbar={this.props.toolbar}>{this.props.children}</Page.Layout>
        )
    }
}

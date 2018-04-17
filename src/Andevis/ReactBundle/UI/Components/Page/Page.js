import React from "@AndevisReactBundle/react";
import PropTypes from "@AndevisReactBundle/prop-types";
import View from "@AndevisReactBundle/UI/Components/View/View";
import { autobind } from "@AndevisReactBundle/decorators";
import PageLayout from "@AndevisReactBundle/UI/Components/Page/PageLayout";
import { Component } from "@AndevisReactBundle/UI/ComponentBase";
import { authStore } from "@AndevisAuthReactBundle/UI/Stores";
import { isGranted, isAuthenticated } from "@AndevisAuthReactBundle/UI/Helpers/security";
import { i18n } from "@AndevisReactBundle/UI/Translation";
import messages from './messages';
import './Page.scss';

export default class Page extends View {

    static propTypes = Object.assign({}, Component.propTypes, {
        title: PropTypes.string,
        toolbar: PropTypes.any
    });

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
     * Go back
     */
    @autobind
    handleGoBack(){
        this.context.router.history.goBack();
    }

    /**
     * Refresh page
     */
    @autobind
    handleRefreshPage(){
        window.location.reload();
    }

    /**
     * Go to login page
     */
    @autobind
    handleGotoLoginPage(){
        let state = {};
        if(this.context.router.history.location !== '/auth/login'){
            // TODO: починить это, обраный редирект не работает
            state.authAfterLoginPath = this.context.router.history.location;
        }
        this.context.router.history.push({
            pathname: '/auth/login',
            state: state
        });
    }

    /**
     * Show technical info
     */
    @autobind
    handleShowTechnicalInfo(){
        this.setState({ showTechnicalInfo: !this.state.showTechnicalInfo });
    }

    /**
     * Access denied page render
     * @return {*}
     */
    renderAccessDenied() {
        return (
            <PageLayout title={i18n(messages.accessDenied)} className={"access-denied-page"}>
                <div>
                    <b>{i18n(messages.whatHappened)}</b>
                    <ul>
                        <li>
                            {i18n(messages.accessDeniedReasonOne)}
                        </li>
                        <li>
                            {i18n(messages.accessDeniedReasonTwo)}
                        </li>
                    </ul>
                </div>
                <div>
                    <b>{i18n(messages.whatCanIDo)}</b>
                    <ul>
                        <li>
                            <a onClick={this.handleGoBack}>{i18n(messages.goBack)}</a>
                        </li>
                        <li>
                            <a onClick={this.handleRefreshPage}>{i18n(messages.refreshPage)}</a>
                        </li>
                        <li>
                            <a onClick={this.handleGotoLoginPage}>{i18n(messages.loginWithSufficientPrivileges)}</a>
                        </li>
                        {/* Показываем техническую информацию доверенным людям */}
                        { isGranted('System:Can debug UI permissions', 'Debug') &&
                        <li>
                            <a onClick={this.handleShowTechnicalInfo}>{i18n(messages.showTechnicalInfo)}</a>
                            {this.state.showTechnicalInfo &&
                            <table className="table table-bordered table-striped">
                                <tbody>
                                <tr>
                                    <th width="30%">Page name</th>
                                    <td>{this.getName()}</td>
                                </tr>
                                <tr>
                                    <th>Current username</th>
                                    <td>{authStore.user.username}</td>
                                </tr>
                                <tr>
                                    <th>User roles</th>
                                    <td>
                                        <ul>
                                            {authStore.userRoles.map((role, i) => (
                                                <li key={i}>{role}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <th>UI backend class</th>
                                    <td>{this.constructor.getBackendClassName()}</td>
                                </tr>
                                </tbody>
                            </table>
                            }
                        </li>
                        }
                        <li>
                            {i18n(messages.contactWithAdministratorOrDeveloper)}
                        </li>
                    </ul>
                </div>
            </PageLayout>
        )
    }

    /**
     * Page render
     * @return {*}
     */
    render(){
        return (
            <PageLayout title={this.title} toolbar={this.props.toolbar}>{this.props.children}</PageLayout>
        )
    }
}
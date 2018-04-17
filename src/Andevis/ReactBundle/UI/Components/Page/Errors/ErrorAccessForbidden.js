import React from '@AndevisReactBundle/react';
import PropTypes from "@AndevisReactBundle/prop-types";
import { isGranted } from "@AndevisAuthReactBundle/UI/Helpers/security";
import { i18n } from "@AndevisReactBundle/UI/Translation";
import { authStore } from "@AndevisAuthReactBundle/UI/Stores";
import messages from "@AndevisReactBundle/UI/Components/Page/messages";
import { autobind } from "@AndevisReactBundle/decorators";
import TechInfoAccessForbiddenError from '@AndevisReactBundle/UI/Common/TechInfoAccessForbiddenError/TechInfoAccessForbiddenError';

export default class ErrorAccessForbidden extends React.Component {

    static contextTypes = {
        router: PropTypes.object,
    };

    static propTypes = {
        component: PropTypes.object
    };

    constructor(props, context){
        super(props, context);
        this.state = {
            showTechnicalInfo: false
        }
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

    render (){
        return (
            <div>
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
                        { isGranted('System:Show technical information', 'Debug') &&
                        <li>
                            {i18n(messages.permissionsNotSynchronized)}
                        </li>
                        }
                        { isGranted('System:Show technical information', 'Debug') &&
                        <li>
                            <a onClick={this.handleShowTechnicalInfo}>{i18n(messages.showTechnicalInfo)}</a>
                            {this.state.showTechnicalInfo &&
                                <TechInfoAccessForbiddenError component={this.props.component} />
                            }
                        </li>
                        }
                        <li>
                            {i18n(messages.contactWithAdministratorOrDeveloper)}
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

import React from '@AndevisReactBundle/react';
import PropTypes from "@AndevisReactBundle/prop-types";
import { i18n } from "@AndevisReactBundle/UI/Translation";
import messages from "@AndevisReactBundle/UI/Components/Page/messages";
import { autobind } from "@AndevisReactBundle/decorators";

export default class ErrorPageNotFound extends React.Component {

    static contextTypes = {
        router: PropTypes.object,
    };

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

    render (){
        return (
            <div>
                <div>
                    <b>{i18n(messages.whatHappened)}</b>
                    <ul>
                        <li>
                            {i18n(messages.notFoundReasonOne)}
                        </li>
                        <li>
                            {i18n(messages.notFoundReasonTwo)}
                        </li>
                        <li>
                            {i18n(messages.notFoundReasonThree)}
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
                            {i18n(messages.contactWithAdministratorOrDeveloper)}
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

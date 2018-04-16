import React from "@AndevisReactBundle/react";
import PageLayout from "@AndevisReactBundle/UI/Components/Page/PageLayout";
import { i18n } from "@AndevisReactBundle/UI/Translation";
import messages from "./messages";
import Page from "@AndevisReactBundle/UI/Components/Page/Page";


export default class PageNotFound extends Page{

    access() {
        return true;
    }

    render(){
        return (
            <PageLayout title={i18n(messages.pageNotFound)} className={"access-denied-page"}>
                <div>
                    <b>{i18n(messages.whatHappened)}</b>
                    <ul>
                        <li>
                            {i18n(messages.accessDeniedReasonOne)}
                        </li>
                        <li>
                            {i18n(messages.accessDeniedReasonTwo)}
                        </li>
                        <li>
                            {i18n(messages.accessDeniedReasonThree)}
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
            </PageLayout>
        )
    }
}
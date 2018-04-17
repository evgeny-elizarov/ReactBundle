import React from '@AndevisReactBundle/react';
import PropTypes from "@AndevisReactBundle/prop-types";
import { Button, Page } from "@AndevisReactBundle/UI/Components";
import { autobind } from '@AndevisReactBundle/decorators';
import messages from './messages';
import {i18n} from "@AndevisReactBundle/UI/Translation/index";

export default class DeletePage extends React.Component {

    static propTypes = {
        entityId: PropTypes.string.isRequired,
        entityClass: PropTypes.string.isRequired,
        entity: PropTypes.object,
        title: PropTypes.string.isRequired,
        canDelete: PropTypes.bool.isRequired,
        rootPath: PropTypes.string.isRequired
    };

    static defaultProps = {
        canDelete: true
    };

    static contextTypes = {
        entityEditor: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
    };

    @autobind
    handleGoBack(){
        this.context.router.history.goBack();
    }

    @autobind
    handleDeleteEntity(){
        this.context.entityEditor.deleteEntity(this.props.entityId);
    }

    render(){
        return (
            <Page.Layout
                title={this.props.title}
                toolbar={
                    <div className="btn-toolbar" role="toolbar">
                        <div className="btn-group" role="group">
                            <Button
                                name="btnBack"
                                onClick={this.props.handleGoBack}
                                title={i18n(messages.btnBack)}
                                className="btn-sm btn-default" />
                        </div>
                    </div>
                }>
                {this.context.entityEditor.renderDeleteForm(this.props)}
                <div className="btn-group pull-left">
                    <Button
                        name="btnCancelDelete"
                        type="button"
                        onClick={this.handleGoBack}
                        title={i18n(messages.btnCancelDelete)}
                        className="btn-default"/>
                    <Button
                        name="btnConfirmDelete"
                        type="button"
                        enabled={this.props.canDelete}
                        onClick={this.handleDeleteEntity}
                        title={i18n(messages.btnConfirmDelete)}
                        className="btn-danger"
                    />
                </div>
            </Page.Layout>
        )
    }
}
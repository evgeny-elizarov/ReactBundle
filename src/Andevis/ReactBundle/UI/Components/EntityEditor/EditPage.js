import React from '@AndevisReactBundle/react';
import PropTypes from "@AndevisReactBundle/prop-types";
import { classNames } from "@AndevisReactBundle/helpers";
import { Button, Page } from "@AndevisReactBundle/UI/Components";
import {i18n} from "@AndevisReactBundle/UI/Translation/index";
import messages from './messages';


/**
 * Edit page
 */
export default class EditPage extends React.Component {

    static propTypes = {
        rootPath: PropTypes.string,
        isNew: PropTypes.bool,
        title: PropTypes.string,
        entityId: PropTypes.string,
        entityClass: PropTypes.string.isRequired,
        entity: PropTypes.object,
        canSave: PropTypes.bool,
        canDelete: PropTypes.bool,
    };

    static defaultProps = {
        isNew: false,
        canSave: true,
        canDelete: true
    };

    static contextTypes = {
        entityEditor: PropTypes.object.isRequired
    };

    constructor(props, context){
        super(props, context);
        this.state = {
            loading: false
        };
    }

    loadData(){
        this.setState({ loading: true }, () => {
            this.context.entityEditor.loadEntity(this.props.entityId).then(() => {
                this.setState({ loading: false });
            });
        })
    }

    componentDidMount(){
        this.loadData();
    }

    render() {
        return (
            <Page.Layout
                title={this.props.title}
                toolbar={
                    <div className="btn-toolbar" role="toolbar">
                        <div className="btn-group" role="group">
                            <Button
                                name="btnDelete"
                                onClick={() => this.context.entityEditor.showDeletePage(this.props.entityId)}
                                enabled={this.props.canDelete && !this.state.loading}
                                title={i18n(messages.btnDelete)}
                                className="btn-sm btn-danger"
                            />
                        </div>
                        <div className="btn-group" role="group">
                            <Button
                                name="btnSave"
                                onClick={() => this.context.entityEditor.saveEntity(this.props.entityId)}
                                enabled={this.props.canSave && !this.state.loading}
                                title={i18n(messages.btnSave)}
                                className="btn-sm btn-success"
                            />
                        </div>
                        <div className="btn-group" role="group">
                            <Button
                                name="btnBack"
                                onClick={() => this.context.entityEditor.showListPage() }
                                title={i18n(messages.btnBackToList)}
                                className="btn-sm btn-default" />
                        </div>
                    </div>
                }>
                <div className={classNames({ 'whirl traditional': this.state.loading})}>
                    {this.context.entityEditor.renderEditForm(this.props)}
                </div>
            </Page.Layout>
        );
    }
}

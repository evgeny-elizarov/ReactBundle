import React from '@AndevisReactBundle/react';
import {Route, Switch } from "@AndevisReactBundle/router";
import PropTypes from "@AndevisReactBundle/prop-types";
import { classNames } from "@AndevisReactBundle/helpers";
import { autobind } from '@AndevisReactBundle/decorators';
import Page from "@AndevisReactBundle/UI/Components/Page/Page";
import ListPage from "./ListPage";
import EditPage from "./EditPage";
import DeletePage from "./DeletePage";
import messages from './messages';
import {i18n} from "@AndevisReactBundle/UI/Translation/index";
import './EntityEditor.scss';


/**
 * Entity editor
 */
export default class EntityEditor extends Page {

    static childContextTypes = Object.assign({}, Page.childContextTypes, {
        entityEditor: PropTypes.object,
    });

    currentPageName;


    getInitialState(){
        return Object.assign({}, super.getInitialState(), {
            entity: null
        });
    }

    getChildContext(){
        return Object.assign(super.getChildContext(), {
            entityEditor: this
        });
    }

    /**
     * Return current page name
     * @returns {*}
     */
    getCurrentPageName(){
        return this.currentPageName;
    }

    /**
     * Load entity list
     */
    loadEntityList(){
        return this.callServerMethod('loadEntityList');
    }

    /**
     * Load entity
     * @param entityId
     */
    @autobind
    loadEntity(entityId = null){
        return this.callServerMethod('loadEntity', entityId).then((entity) => {
            this.setState({ entity: entity });
            return entity;
        });
    }

    /**
     * Save entity
     * @param entityId
     * @returns {Promise}
     */
    @autobind
    saveEntity(entityId){
        return this.callServerMethod('saveEntity', entityId)
            .then((entity) => {
                if(entity){
                    this.setState({ entity: entity }, () => {
                        if(!entityId) this.showEditPage(this.getEntityId(entity));
                    });
                }
            });
    }

    /**
     * Delete entity
     * @param entityId
     * @returns {Promise}
     */
    @autobind
    deleteEntity(entityId){
        return this.callServerMethod('deleteEntity', entityId).then((deleted) => {
            if(deleted) this.showListPage();
        });
    }

    /**
     * Get entity class
     */
    getEntityClass(){
        throw new Error('Not implemented!');
    }

    /**
     * Get entity Id
     * @param entity
     * @returns {null}
     */
    getEntityId(entity){
        return entity.hasOwnProperty(this.getEntityIdField()) ? entity[this.getEntityIdField()] : null;
    }

    /**
     * Get entity ID field
     * @returns {string}
     */
    getEntityIdField(){
        return 'id';
    }

    /**
     * Get router root path
     */
    getRootPath(){
        return this.context.router.route.match.path;
    }

    /**
     * Get list page actions column
     */
    @autobind
    getListActionsColumn(){
        return {
            Header: i18n(messages.actions),
            className: 'actions-column',
            width: 70,
            filterable: false,
            sortable: false,
            Cell: row => <div className="action-buttons pull-right">
                {this.getListRowActions().map((action, i) => {
                    let enabled = true;
                    if(action.hasOwnProperty('accessCallback'))
                    {
                        enabled = action.accessCallback(row.original);
                    }
                    return (
                        <button
                            key={i}
                            className={classNames("btn btn-sm action-"+action.name, action.className)}
                            onClick={() => {
                                if(!action.callback){
                                    throw new Error('Action callback not set');
                                }
                                action.callback(row.original);
                            }}
                            disabled={!enabled}
                            title={action.title}
                            data-index={row.index} />
                    )
                })}
            </div>
        }
    }

    /**
     * Get list page title
     * @returns {*}
     */
    getListPageTitle(){
        return i18n(messages.pageListTitle, {
            entityClass: this.getEntityClass()
        });
    }

    /**
     * Get list columns
     */
    @autobind
    getListColumns(){
        return [
            {
                accessor: this.getEntityIdField(),
                Header: 'ID'
            },
        ];
    }

    /**
     * Get list row actions
     * @returns {[null,null]}
     */
    @autobind
    getListRowActions(){
        return [
            {
                name: 'edit',
                className: 'btn-default fa fa-pencil',
                title: i18n(messages.listRowEdit),
                callback: (entity) => (
                    this.setState({ entity: entity }, () => {
                        this.showEditPage(this.getEntityId(entity));
                    })
                )
            },
            {
                name: 'delete',
                className: 'btn-default fa fa-trash',
                title: i18n(messages.listRowDelete),
                accessCallback: this.canDelete,
                callback: (entity) => (
                    this.setState({ entity: entity }, () => {
                        this.showDeletePage(this.getEntityId(entity));
                    })
                )
            }
        ];
    }


    /**
     * Return true if can save
     * @param entity
     * @returns {boolean}
     */
    canSave(entity){
        return true;
    }

    /**
     * Return true if can delete
     * @param entity
     * @returns {boolean}
     */
    canDelete(entity){
        return true;
    }

    /**
     * Show add page
     */
    @autobind
    showAddPage(){
        this.context.router.history.push(this.getRootPath() + '/add');
    }

    /**
     * Show list page
     */
    @autobind
    showListPage(){
        this.props.history.push(this.getRootPath());
    }

    /**
     * Show edit page
     * @param entityId
     */
    @autobind
    showEditPage(entityId) {
        this.props.history.push(this.getRootPath() + '/' + entityId + '/edit');
    }

    /**
     * Show delete page
     * @param entityId
     */
    @autobind
    showDeletePage(entityId) {
        this.props.history.push(this.getRootPath() + '/' + entityId + '/delete');
    }

    /**
     * Get entity name
     * @param entity
     */
    getEntityName(entity){
        return entity.id;
    }


    /**
     * Get page routes
     * @param rootPath
     * @returns {[object]}
     */
    getPagesRoutes(rootPath){
        return [
            // List page
            {
                exact: true,
                path: rootPath,
                render: () => {
                    this.currentPageName = 'list';
                    return this.renderListPage({
                        rootPath: this.getRootPath(),
                        title: this.getListPageTitle(),
                        columns: this.getListColumns()
                    })
                }
            },
            // Add page
            {
                path: rootPath + '/add',
                render: () => {
                    this.currentPageName = 'add';
                    return this.renderEditPage({
                        isNew: true,
                        entityId: null,
                        entityClass: this.getEntityClass(),
                        entity: this.state.entity,
                        title: i18n(messages.pageAddTitle, {
                            entityClass: this.getEntityClass()
                        }),
                        canSave: this.canSave(this.state.entity),
                        canDelete: false,
                        rootPath: this.getRootPath(),
                    })
                }
            },
            // Edit page
            {
                path: rootPath + '/:id/edit',
                render: (routerProps) => {
                    this.currentPageName = 'edit';
                    const entityName = (this.state.entity) ?
                        this.getEntityName(this.state.entity) :
                        routerProps.match.params.id;
                    return this.renderEditPage({
                        isNew: false,
                        entityId: routerProps.match.params.id,
                        entityClass: this.getEntityClass(),
                        entity: this.state.entity,
                        title: i18n(messages.editPageTitle, {
                            // entityClass: this.getEntityClass(),
                            entityName: entityName
                        }),
                        canSave: this.canSave(this.state.entity),
                        canDelete: this.canDelete(this.state.entity),
                        rootPath: this.getRootPath(),
                    });
                }
            },
            // Delete page
            {
                path: rootPath + '/:id/delete',
                render: (routerProps) => {
                    this.currentPageName = 'delete';
                    const entityName = (this.state.entity) ?
                        this.getEntityName(this.state.entity) :
                        routerProps.match.params.id;
                    return this.renderDeletePage({
                        entityId: routerProps.match.params.id,
                        entityClass: this.getEntityClass(),
                        entity: this.state.entity,
                        title: i18n(messages.pageDeleteTitle, {
                            // entityClass: this.getEntityClass(),
                            entityName: entityName
                        }),
                        canDelete: this.canDelete(this.state.entity),
                        rootPath: this.getRootPath(),
                    })
                }
            }
        ];
    }

    /**
     * Render manger main page
     */
    render() {
        return (
            <Switch>
                {this.getPagesRoutes(this.getRootPath()).map((routeProps, i) => (
                    <Route key={i} {...routeProps} />
                ))}
            </Switch>
        )
    }

    /**
     * Render manger list page
     */
    @autobind
    renderListPage(props){
        return (
            <ListPage {...props} />
        )
    }

    @autobind
    renderListPageFilter(props){
        return null;
    }

    /**
     * Render add/edit page
     */
    @autobind
    renderEditPage(props) {
        return (
            <EditPage {...props}/>
        )
    }

    /**
     * Render edit form
     * @param props
     * @returns {XML}
     */
    @autobind
    renderEditForm(props){
        return (
            <p>To overrider this text, redefine renderEditForm method</p>
        )
    }

    /**
     * Render delete page
     */
    @autobind
    renderDeletePage(props){
        return (
            <DeletePage {...props} />
        )
    }

    /**
     * Render delete form
     * @param props
     * @returns {*}
     */
    @autobind
    renderDeleteForm(props){
        return (
            <p>{i18n(messages.confirmDelete, {
                entityClass: this.getEntityClass(),
                entityName: (props.entity) ? this.getEntityName(props.entity) : props.entityId
            })}</p>
        )
    }
}

export {
    EntityEditor,
    ListPage,
    EditPage
}
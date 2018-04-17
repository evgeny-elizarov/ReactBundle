import React from 'react';
import { Component } from './../../ComponentBase';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import PropTypes from "prop-types";
import hotKeys from "@AndevisReactBundle/hotkeys";

/**
 * Button component
 */

// TODO: эмулировать поведение submit типа, просто брать родительскую форму и вызывать submit
// TODO: это повзолит дисейблить кнопку на момент выполнения submit события
export default class Button extends Component
{
    static propTypes = Object.assign({}, Component.propTypes, {
        title: PropTypes.string,
        hotKey: PropTypes.string
    });

    static defaultProps = Object.assign({}, Component.defaultProps, {
        type: "button",
    });

    hotKeySubsIndex = null;

    componentDidMount(){
        super.componentDidMount();

        // Register hot keys
        if(this.props.hotKey){
            this.hotKeySubsIndex = hotKeys.registerHotKey(this.props.hotKey, this.click);
        }
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        hotKeys.unregisterHotKey(this.hotKeySubsIndex);
    }

    // Attribute: isProcessing
    get isProcessing() {
        return this.getAttributeValue('isProcessing', false);
    }
    set isProcessing(value) {
        this.setAttributeValue('isProcessing', value);
    }

    static bundleName = 'React';

    // TODO: для всех встроеных компонентов прописать класс вручную, это позволяет расширять базовые компоненты на фронте
    getShortClassName() {
        return 'Button';
    }

    // Attribute: title
    get title() {
        return this.getAttributeValue('title', this.props.title || this.props.name || this.constructor.name);
    }
    set title(value) {
        this.setAttributeValue('title', value);
    }

    eventList(){
        return super.eventList().concat(['click', 'doubleClick']);
    }

    /**
     * Click event
     */
    @autobind
    click(e) {
        this.setAttributeValue('isProcessing', true, () =>
            this.fireEvent('click').finally(() => {
                if(!this.unmounted){
                    this.setAttributeValue('isProcessing', false);
                }
            })
        );
    }

    /**
     * Double click event
     */
    @autobind
    doubleClick(e) {
        this.setAttributeValue('isProcessing', true, () =>
            this.fireEvent('doubleClick').finally(() => {
                if(!this.unmounted){
                    this.setAttributeValue('isProcessing', false);
                }
            })
        );
    }



    /**
     * Render event
     * @returns {XML}
     */
    render() {
        // If image button
        let content = this.title;

        if(this.props.image)
            content = <img src={this.props.image} title={this.title} />;
        else if(this.props.children)
            content = this.props.children;
        return (
            <button
                // id={this.id}
                // name={this.name}
                type={this.props.type}
                style={this.props.style}
                className={ classNames('btn', this.props.className, {
                    'btn-default': !this.props.className
                })}
                onClick={this.click}
                onDoubleClick={this.doubleClick}
                disabled={!this.enabled || this.isProcessing}
            >{content}</button>
        );
    }
}

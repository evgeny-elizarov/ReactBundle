import React from 'react';
import { Component } from './../../ComponentBase';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import PropTypes from "prop-types";

/**
 * Button component
 */

// TODO: эмулировать поведение submit типа, просто брать родительскую форму и вызывать submit
// TODO: это повзолит дисейблить кнопку на момент выполнения submit события
export default class Button extends Component
{
    static propTypes = Object.assign({}, Component.propTypes, {
        title: PropTypes.string,
    });

    static defaultProps = Object.assign({}, Component.defaultProps, {
        type: "button",
    });

    // Attribute: isProcessing
    get isProcessing() {
        return this.getAttributeValue('isProcessing', false);
    }
    set isProcessing(value) {
        this.setAttributeValue('isProcessing', value);
    }

    getBundleName() {
        return 'React';
    }

    // Attribute: title
    get title() {
        return this.getAttributeValue('title', this.props.title || this.props.name || this.constructor.name);
    }
    set title(value) {
        this.setAttributeValue('title', value);
    }

    eventList(){
        return super.eventList().concat(['click']);
    }

    /**
     * Click event
     */
    @autobind
    click(e) {
        this.setAttributeValue('isProcessing', true, ()=> {
            this.fireEvent('click').finally(() => {
                if(!this._willUnmount){
                    this.setAttributeValue('isProcessing', false);
                }
            })
        });
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
                className={ classNames(this.props.className, 'btn')}
                onClick={this.click}
                disabled={!this.enabled || this.isProcessing}
            >{content}</button>
        );
    }
}

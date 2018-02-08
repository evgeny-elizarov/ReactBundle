import React from 'react';
import { FormField } from 'react-form';
import { autobind } from 'core-decorators';
import {FormInputBase, InputWrapper } from "@AndevisReactBundle/UI/Components/Form/FormInputBase";
import { SelectBase } from "@AndevisReactBundle/UI/Components/Select/Select";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LoadingSpinner from "../../Widgets/LoadingSpinner/LoadingSpinner";
import './AutoComplete.scss';

class AutoCompleteBase extends SelectBase {

    static propTypes = Object.assign({}, SelectBase.propTypes, {
        delay: PropTypes.number.isRequired
    });

    static defaultProps = Object.assign({}, SelectBase.defaultProps, {
        delay: 500
    });

    eventList() {
        return super.eventList.concat(['search','selectOption']);
    }

    getBundleName() {
        return 'React';
    }

    /**
     * Attribute: text
     * @returns {*}
     */
    get text() {
        return this.getAttributeValue('text', '');
    }

    set text(value) {
        this.setAttributeValue('text', value);
    }

    /**
     * Attribute: isLoading
     * @returns {*}
     */
    get isLoading() {
        return this.getAttributeValue('isLoading', false);
    }

    set isLoading(value) {
        this.setAttributeValue('isLoading', value);
    }

    /**
     * Attribute: expanded
     * @returns {*}
     */
    get expanded() {
        return this.getAttributeValue('expanded', false);
    }

    set expanded(value) {
        this.setAttributeValue('expanded', value);
    }

    // TODO: перенести эту логику в Select
    @autobind
    selectOption(option) {
        this.props.fieldApi.setValue(option.value);

        const attrText = this.getAttributeStateName('text');
        const attrValue = this.getAttributeStateName('value');
        const attrExpanded = this.getAttributeStateName('expanded');
        const attrIsLoading = this.getAttributeStateName('isLoading');
        let newState = {};
        newState[attrText] = option.text;
        newState[attrValue] = option.value;
        newState[attrExpanded] = false;

        this.setState(newState, () => {
            (async () => {
                await this.fireEvent('selectOption');
            })();
            let newState = {};
            newState[attrIsLoading] = true;

            this.setState(newState, () => {
                (async () => {
                    await this.fireEvent('input');

                    let newState = {};
                    newState[attrIsLoading] = false;
                    newState[attrExpanded] = false;
                    this.setState(newState);
                })();
            });
        });
    }

    search(newText) {
        // const attrValue = this.getAttributeStateName('value');
        const attrText = this.getAttributeStateName('text');
        const attrExpanded = this.getAttributeStateName('expanded');
        const attrIsLoading = this.getAttributeStateName('isLoading');
        let newState = {};
        newState[attrText] = newText;
        newState[attrExpanded] = this.options.length > 0;

        this.setState(newState, () => {
            if (!this._searchTimer && !this.getAttributeValue('isLoading')) {
                this._searchTimer = setTimeout(() => {
                    clearTimeout(this._searchTimer);
                    this._searchTimer = null;
                    let newState = {};
                    newState[attrIsLoading] = true;
                    this.setState(newState, () => {
                        (async () => {
                            await this.fireEvent('change', newText);
                            let newState = {};
                            newState[attrIsLoading] = true;
                            newState[attrExpanded] = this.options.length > 0;
                            this.setState(newState);
                        })();
                    });
                }, this.props.delay);
            }
        });
    }

    @autobind
    handleOnInputEvent(event) {
        this.search(event.target.value);
    }

    @autobind
    handleOnFocusEvent(event) {
        if (this.options.length > 0) this.expanded = true;
    }

    @autobind
    handleOnBlurEvent(event) {
        if (this.props.fieldApi) this.props.fieldApi.setTouched();
    }

    render() {
        let props = Object.assign({}, this.props);
        if (!props.placeholder)
            props.placeholder = this.getValueFormat();

        props.className = classNames(props.className, "form-input-autoComplete");
        return (
            <InputWrapper hasFocus={this.hasFocus} {...props}>
                <LoadingSpinner show={this.isLoading} />
                <input
                    ref="inputElement"
                    className={classNames('form-control', this.props.inputClassName )}
                    placeholder={this.props.placeholder}
                    autoComplete={this.props.autoComplete}
                    required={this.props.required}
                    readOnly={this.props.readOnly}
                    onInput={this.handleOnInputEvent}
                    onBlur={this.handleOnBlurEvent}
                    onClick={this.handleOnClickEvent}
                    onFocus={this.handleOnFocusEvent}
                    // onChange={this.handleOnChangeEvent}
                    disabled={!this.enabled}
                    value={this.text} />
                <div className={"options-container"}>
                    <div className={"options"} style={{ display: this.expanded ? 'block' : 'none' }}>
                        {this.options.map((opt, i) =>
                            <div
                                key={i}
                                className="option"
                                onFocus={this.handleOnFocusEvent}
                                onClick={(event) => {
                                    this.selectOption(opt, i, event);
                                }}>
                                {opt.text}
                            </div>
                        )}
                    </div>
                </div>
            </InputWrapper>
        );
    }
}


@FormField
export default class AutoComplete extends AutoCompleteBase {}

export {
    AutoCompleteBase,
    AutoComplete
}
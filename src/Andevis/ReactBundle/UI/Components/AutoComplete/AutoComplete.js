import React from 'react';
import Autocomplete from 'react-autocomplete';
import { autobind } from 'core-decorators';
import { FormField } from 'react-form';
import { SelectBase } from "@AndevisReactBundle/UI/Components/Select/Select";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { InputWrapper } from "@AndevisReactBundle/UI/Components/Form/FormInputBase";
import {filterObjectByKeys} from "@AndevisReactBundle/UI/Helpers";
import { i18n } from "@AndevisReactBundle/UI/Translation";
import messages from './messages';
import './AutoComplete.scss';


class AutoCompleteBase extends SelectBase {

    static propTypes = Object.assign({}, SelectBase.propTypes, {
        renderItem: PropTypes.func,
        dataFetchDelay: PropTypes.number.isRequired,
        minLength: PropTypes.number,
        className: PropTypes.any,
        fetchOnEnter: PropTypes.bool,
        useCache: PropTypes.bool,
        inputProps: PropTypes.object
    });

    static defaultProps = Object.assign({}, SelectBase.defaultProps, {
        dataFetchDelay: 250,
        minLength: 2,
        fetchOnEnter: false,
        useCache: false
    });


    getBundleName() {
        return 'React';
    }

    getInitialState(){
        return {
            ingnoreFetch: false
        }
    }
    // Attribute: selectedOption
    get selectedOption() {
        return this.getAttributeValue('selectedOption', null);
    }

    set selectedOption(value) {
        this.setAttributeValue('selectedOption', value);
    }

    // Attribute: text
    get text() {
        return this.getAttributeValue('text', '');
    }

    set text(value) {
        this.setAttributeValue('text', value);
    }

    // Attribute: isProcessing
    get isLoading() {
        return this.getAttributeValue('isLoading', false);
    }
    set isLoading(value) {
        this.setAttributeValue('isLoading', value);
    }

    eventList() {
        return super.eventList.concat(['fetchOptions', 'selectOption']);
    }

    componentDidMount(){
        super.componentDidMount();
        this.optionsCache = {};
    }

    /**
     * Fetch options
     * @param input
     * @returns {*|Promise<any>}
     */
    fetchOptions(input){
        let internalRepeat = 0;
        const inputText = input;
        this.autoComplete.setState({ isOpen: true });
        if(this.props.useCache && this.optionsCache.hasOwnProperty(input))
        {
            this.setAttributes({
                text: input,
                options: this.optionsCache[input].slice(0) // clone cached options
            });
        } else {
            this.setAttributes({
                    text: input,
                    isLoading: true },
                () => {
                    this.fireEvent('fetchOptions', input)
                        .then((options) => {
                            internalRepeat += 1;
                            if (!Array.isArray(options)) {
                                throw new Error('fetchOptions event must return array of options!');
                            }
                            // if input text not changed when loading
                            if (inputText === this.text) {
                                this.optionsCache[inputText] = options;
                                this.autoComplete.setState({ isOpen: true});
                                this.setAttributes({
                                    isLoading: false,
                                    options: options
                                }, () => {
                                    clearTimeout(this.inputInterval);
                                    this.inputInterval = null;
                                });

                            } else {
                                clearTimeout(this.inputInterval);
                                this.inputInterval = null;
                                if (internalRepeat <= 10) {
                                    this.fetchOptions(this.text);
                                } else {
                                    throw new Error('Recursion detected!');
                                }
                            }
                            return options;
                        }).catch((e) => {
                            delete this.optionsCache[inputText];
                            this.setAttributes({ isLoading: false }, () => {
                                clearTimeout(this.inputInterval);
                                this.inputInterval = null;
                            });
                    });
                });
        }
    }

    /**
     * Select option
     * @param option
     */
    selectOption(option) {
        this.autoComplete.setState({ isOpen: false });
        return this.fireEvent('selectOption', option).then(() => {
            this.setAttributes({
                selectedOption: option
            });
        });
    }

    /**
     * Reset selected option
     */
    resetSelectedOption(){
        this.setAttributes({ text: '' });
        this.change('').then(() => {
            this.selectOption(null);
        });
    }

    /**
     * Reset loaded options
     */
    resetOptions(){
        this.setAttributes({ options: [] })
    }

    @autobind
    handleSelectOption(text, option){
        this.autoComplete.setState({ isOpen: false });
        this.setAttributes({ text: option.text });
        this.change(option.value).then(() => {
            this.selectOption(option);
        });
    }

    @autobind
    handleRenderMenu(items, value, style){
        const menuStyle = Object.assign(style, {
            borderRadius: '3px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.9)',
            fontSize: '90%',
            position: 'fixed',
            overflow: 'auto',
            maxHeight: '50%' });

        return (
            <div className="autoComplete-component-options-menu" style={menuStyle}>
                {this.isLoading ?
                    ('...' + i18n(messages.loading)):
                    (items)
                }
            </div>
        );
    }

    @autobind
    handleRenderItem(item, isHighlighted){
        if(this.props.renderItem){
            return this.props.renderItem(item, isHighlighted);
        } else {
            return (
                <div
                    key={item.value}
                    className={classNames('option', {"highlighted" : isHighlighted })}>
                    {item.text}
                </div>
            )
        }
    }

    @autobind
    handleChangeEvent(e){
        const inputText = e.target.value;

        // Reset selected option when text changed
        if(this.selectedOption && this.selectedOption.text !== inputText){
            this.resetSelectedOption();
        }

        if(inputText.length >= this.props.minLength)
        {
            this.setAttributes({ text: inputText });
            if(!this.props.fetchOnEnter)
            {
                if (!this.inputInterval) {
                    this.inputInterval = setTimeout(() => {
                        this.fetchOptions(this.text);
                    }, this.props.dataFetchDelay);
                }
            }

        } else {
            this.autoComplete.setState({ isOpen: false });
            this.setAttributes({
                options: [],
                text: inputText
            });
        }
    }

    @autobind
    handleKeyDown(e){
        if(this.props.fetchOnEnter && e.key === 'Enter'){
            e.preventDefault();
            if(this.autoComplete.state.highlightedIndex !== null) return;
            // const needFetch = (this.value !== '' || this.text !== e.target.value);
            // console.log("handleKeyDown", this.autoComplete.state.highlightedIndex, needFetch, this.value, this.text, e.target.value);
            // this.autoComplete.setIgnoreBlur(false);

            if(e.target.value.length >= this.props.minLength){
                this.fetchOptions(this.text);
            }
        }
    }

    render(){
        // InputWrapper
        let wrapperProps = filterObjectByKeys(this.props, ['className', 'helpText']);

        const inputProps = Object.assign({
            className: 'form-control',
            onKeyDown: this.handleKeyDown,
            disabled: !this.enabled,
            placeholder: this.props.placeholder
        }, this.props.inputProps);

        return (
            <InputWrapper {...wrapperProps}>
                <Autocomplete
                    ref={(autoComplete) => { this.autoComplete = autoComplete; }}
                    getItemValue={(item) => item.text}
                    autoHighlight={false}
                    items={this.options}
                    renderItem={this.handleRenderItem}
                    renderMenu={this.handleRenderMenu}
                    value={this.text}
                    wrapperProps={{
                        className: null,
                        style: null
                    }}
                    inputProps={inputProps}
                    onChange={this.handleChangeEvent}
                    onSelect={this.handleSelectOption}
                />
            </InputWrapper>
        )
    }
}


@FormField
export default class AutoComplete extends AutoCompleteBase {}

export {
    AutoCompleteBase,
    AutoComplete
}

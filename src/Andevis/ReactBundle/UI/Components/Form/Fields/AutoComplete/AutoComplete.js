import React from 'react';
import ReactAutocomplete from 'react-autocomplete';
import { autobind } from 'core-decorators';
// import { FormField } from 'react-form';
import { TextBase } from "@AndevisReactBundle/UI/Components/Form/Fields/Text/Text";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formFieldWrapper } from "@AndevisReactBundle/UI/Components/Form/Field";
import InputWrapper from "@AndevisReactBundle/UI/Components/Form/InputWrapper";
import { filterObjectByKeys } from "@AndevisReactBundle/UI/Helpers";
import { i18n } from "@AndevisReactBundle/UI/Translation";
import messages from './messages';
import './AutoComplete.scss';
import { Component } from "@AndevisReactBundle/UI/ComponentBase";


class AutoCompleteBase extends TextBase {

    static propTypes = Object.assign({}, TextBase.propTypes, {
        dataSource: PropTypes.array,
        /**
         * The data fields property maps the columns of the data table and binds the data to the component.
            text - Maps the text column from data table for each list item
            value - Maps the value column from data table for each list item
         */
        dataFields: PropTypes.object,

        // dataFetchDelay: PropTypes.number.isRequired,
        minLength: PropTypes.number,
        className: PropTypes.any,
        fetchOnEnter: PropTypes.bool,
        // useCache: PropTypes.bool,

        renderItem: PropTypes.func,
        inputProps: PropTypes.object,
        selectOnBlur: PropTypes.bool,
        menuStyle: PropTypes.object,
        isItemSelectable: PropTypes.func,
    });

    static defaultProps = Object.assign({}, TextBase.defaultProps, {
        minLength: 1,
        fetchOnEnter: true,
        //dataFetchDelay: 250,
        // useCache: false
    });

    static bundleName = 'React';

    getShortClassName(){
        return 'AutoComplete';
    }

    getInitialState(){
        return {
            ingnoreFetch: false
        }
    }

    constructor(props, context){
        super(props, context);
        this._fetchDataTimeout = null;
    }

    // Attribute: selectedItem
    get selectedItem() {
        return this.getAttributeValue('selectedItem', null);
    }

    set selectedItem(value) {
        this.setAttributeValue('selectedItem', value);
    }

    // Attribute: dataSource
    get dataSource() {
        return this.getAttributeValue('dataSource', this.props.dataSource);
    }

    set dataSource(value) {
        this.setAttributeValue('dataSource', value);
    }

    getAttributesLinkedToProps(){
        return super.getAttributesLinkedToProps().concat(['dataSource']);
    }

    // Attribute: isProcessing
    get isLoading() {
        return this.getAttributeValue('isLoading', false);
    }
    set isLoading(value) {
        this.setAttributeValue('isLoading', value);
    }

    eventList() {
        return super.eventList.concat(['fetchData', 'select']);
    }

    componentDidMount(){
        super.componentDidMount();
        this.optionsCache = {};
    }

    updateDataOnInput(value){
        if(value.length >= this.props.minLength){
            this.isOpen(true);
            this.fetchData(value).then(() => {
                if(value !== this.value) {
                    this.updateDataOnInput(this.value);
                } else {
                    this._fetchDataTimeout = null;
                }
            });
        } else {
            this._fetchDataTimeout = null;
            this.setAttributes({
                dataSource: this.props.dataSource
            });
        }
    }

    @autobind
    handleInputEvent(event){
        this._inputProcess = true;
        const value = event.target.value;
        this.setValue(value);
        this.input(value).then(() => {
            this._inputProcess = false;
        })
        // .then(() => {
        //     if(this._fetchDataTimeout === null) {
        //         this._fetchDataTimeout = setTimeout(
        //             () => this.updateDataOnInput(value),
        //             this.props.dataFetchDelay
        //         );
        //     }
        // });
    }

    /**
     * Fetch data
     */
    fetchData(input){
        this.setAttributes({ isLoading: true });
        return this.fireEvent('fetchData', input)
            .then((data) => {
                this.setAttributes({
                    isLoading: false,
                    dataSource: data
                });
                return data;
            });
    }

    /**
     * Fetch options
     * @param input
     * @returns {*|Promise<any>}
     */
    // _fetchOptions(input){
    //     let internalRepeat = 0;
    //     const inputText = input;
    //     this.autoComplete.setState({ isOpen: true });
    //     if(this.props.useCache && this.optionsCache.hasOwnProperty(input))
    //     {
    //         this.setAttributes({
    //             text: input,
    //             options: this.optionsCache[input].slice(0) // clone cached options
    //         });
    //     } else {
    //         this.setAttributes({
    //                 text: input,
    //                 isLoading: true },
    //             () => {
    //                 this.fireEvent('fetchOptions', input)
    //                     .then((options) => {
    //                         internalRepeat += 1;
    //                         if (!Array.isArray(options)) {
    //                             throw new Error('fetchOptions event must return array of options!');
    //                         }
    //                         // if input text not changed when loading
    //                         if (inputText === this.text) {
    //                             this.optionsCache[inputText] = options;
    //                             this.autoComplete.setState({ isOpen: true});
    //                             this.setAttributes({
    //                                 isLoading: false,
    //                                 options: options
    //                             }, () => {
    //                                 clearTimeout(this.inputInterval);
    //                                 this.inputInterval = null;
    //                             });
    //
    //                         } else {
    //                             clearTimeout(this.inputInterval);
    //                             this.inputInterval = null;
    //                             if (internalRepeat <= 10) {
    //                                 this.fetchOptions(this.text);
    //                             } else {
    //                                 throw new Error('Recursion detected!');
    //                             }
    //                         }
    //                         return options;
    //                     }).catch((e) => {
    //                         delete this.optionsCache[inputText];
    //                         this.setAttributes({ isLoading: false }, () => {
    //                             clearTimeout(this.inputInterval);
    //                             this.inputInterval = null;
    //                         });
    //                 });
    //             });
    //     }
    // }

    isOpen(){
        if(arguments.length > 0){
            const newValue = (arguments[0]); // Convert to boolean
            if(this.autoComplete) this.autoComplete.setState({ isOpen: newValue });
        }
        if(this.autoComplete) return this.autoComplete.state.isOpen;
    }

    /**
     * Select item
     * @param item
     */
    select(item) {
        return this.setAttributes({ selectedItem: item }).then(() => {
            return this.fireEvent('select', item);
        });

    // .then(() => {
    //         this.setAttributes({ selectedItem: item });
    //     })
    }

    /**
     * Change event
     * @param newValue
     * @returns {*|Promise<any>}
     */
    @autobind
    change(newValue) {
        return super.change(newValue).then(() => {
            if(newValue == '') this.setAttributes({ selectedItem: null });
        });
    }

    //
    // /**
    //  * Reset selected option
    //  */
    // resetSelectedOption(){
    //     this.setAttributes({ text: '' });
    //     this.change('').then(() => {
    //         this.selectOption(null);
    //     });
    // }

    // /**
    //  * Reset loaded options
    //  */
    // resetOptions(){
    //     this.setAttributes({ options: [] })
    // }

    /**
     * Set value
     * @param value
     */
    setValue(newValue){
        super.setValue(newValue);
        // Reset seleted value
        if(!newValue || newValue == '')
            this.selectedItem = null;
    }

    @autobind
    handleSelectOption(text, item){
        const value = this.getItemValue(item);
        this.setValue(value);
        this.change(value);
        this.isOpen(false);
        this.select(item);
        // this.change(this.getItemValue(item)).then(() =>
        //
        // );
    }

    /**
     * Render items menu
     */
    @autobind
    renderMenu(items, value, style) {
        return (
            <div className="autoComplete-form-component-menu" style={style}>
                {this.isLoading ? '...'+i18n(messages.loading) : (
                    (!this.dataSource || this.dataSource.length == 0) ?
                        i18n(messages.empty) : items
                )}
            </div>
        );
    }

    /**
     * Render item
     */
    @autobind
    renderItem(item, isHighlighted){
        const text = this.getItemText(item);
        return (
            <div
                key={typeof item === 'object' ? item.key : item}
                className={classNames('item', {"highlighted" : isHighlighted })}>
                {this.props.renderItem ? this.props.renderItem(item, isHighlighted) : text}
            </div>
        )
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
            this.isOpen(false);
            this.setAttributes({
                options: [],
                text: inputText
            });
        }
    }

    @autobind
    handleKeyDown(event){
        const value = event.target.value;
        if(this.props.fetchOnEnter && event.key === 'Enter'){
            event.preventDefault();
            if(this.autoComplete && this.autoComplete.state.highlightedIndex !== null) return;
            // const needFetch = (this.value !== '' || this.text !== e.target.value);
            // console.log("handleKeyDown", this.autoComplete.state.highlightedIndex, needFetch, this.value, this.text, e.target.value);
            // this.autoComplete.setIgnoreBlur(false);
            if(value.length >= this.props.minLength){
                this.isOpen(true);
                this.fetchData(value);
            }
        }
    }

    /**
     * Should item render
     */
    @autobind
    shouldItemRender(item, value){
        const text = this.getItemText(item) || '';
        return text.toLowerCase().indexOf(value.toLowerCase()) > -1
    }

    /**
     * Get item value
     */
    @autobind
    getItemValue(item){
        if(
            typeof this.props.dataFields === 'object' &&
            this.props.dataFields.hasOwnProperty('value')
        ){
            return (item.hasOwnProperty(this.props.dataFields.value)) ? item[this.props.dataFields.value] : item;
        } else {
            return item;
        }
    }

    /**
     * Get item text
     */
    @autobind
    getItemText(item){
        if(
            typeof this.props.dataFields === 'object' &&
            this.props.dataFields.hasOwnProperty('text')
        ){
            return (item.hasOwnProperty(this.props.dataFields.text)) ? item[this.props.dataFields.text] : this.getItemValue(item);
        } else {
            return this.getItemValue(item);
        }
    }

    getFieldWrapperProps(){
        let props = super.getFieldWrapperProps();
        props.className += ' auto-complete-form-component';
        return props;
    }

    getFieldControlProps(){

        if(this.readOnly){
            return super.getFieldControlProps();
        } else {
            const inputProps = Object.assign({
                className: 'form-control',
                style: {},
                type: 'text',
                onKeyDown: this.handleKeyDown,
                required: this.props.required,
                readOnly: this.readOnly,
                onBlur: this.handleBlurEvent,
                onFocus: this.handleFocusEvent,
                onClick: this.click,
                onDoubleClick: this.doubleClick,
                disabled:  (
                    !this.enabled ||
                    (
                        this.context.hasOwnProperty('form') &&
                        typeof this.context.form === Component &&
                        this.context.form.backendEventProcessing
                    )
                ),
                placeholder: this.props.placeholder
            }, this.props.inputProps);


            // Add index items in data source
            let dataSource = this.dataSource || [];
            dataSource = dataSource.map((item, i) => {
                if(typeof item === 'object') item.key = i;
                return item;
            })

            const attr = Object.assign({
                ref: (autoComplete) => {
                    this.autoComplete = autoComplete;
                    this.refInput = autoComplete;
                },
                items: this.dataSource || [],
                renderItem: this.renderItem,
                renderMenu: this.renderMenu,
                value: this.value || '',
                onChange: this.handleInputEvent,
                onSelect: this.handleSelectOption,
                shouldItemRender: this.shouldItemRender,
                getItemValue: this.getItemValue,
                inputProps: inputProps,
                wrapperStyle: {}

            }, filterObjectByKeys(this.props, [
                'wrapperStyle', 'renderMenu'
            ]));
            return attr;
        }
    }

    render(){
        if(this.readOnly){
            return super.render();
        } else {
            return (
                <InputWrapper {...this.getFieldWrapperProps()}>
                    <ReactAutocomplete {...this.getFieldControlProps()} />
                </InputWrapper>
            )
        }
    }
}


@formFieldWrapper
export default class AutoComplete extends AutoCompleteBase {}

export {
    AutoCompleteBase,
    AutoComplete
}

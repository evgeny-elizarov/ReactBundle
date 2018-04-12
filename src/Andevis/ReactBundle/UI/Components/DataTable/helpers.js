import React from 'react';
import { i18n } from "@AndevisReactBundle/UI/Translation";
import messages from './messages';

const i18nWrapper = (ReactTable) => {

    class i18nWrapper extends React.Component{
        getWrappedInstance() {
            if (!this.wrappedInstance) console.warn('<component name here> - No wrapped instance')
            if (this.wrappedInstance.getWrappedInstance) return this.wrappedInstance.getWrappedInstance()
            else return this.wrappedInstance
        }
        render(){
            const extProps = Object.assign({}, this.props, {
                previousText: i18n(messages.previousText),
                nextText: i18n(messages.nextText),
                loadingText: i18n(messages.loadingText),
                noDataText: i18n(messages.noDataText),
                pageText: i18n(messages.pageText),
                ofText: i18n(messages.ofText),
                rowsText: i18n(messages.rowsText),
            });
            return <ReactTable ref={(ref) => this.wrappedInstance = ref} {...extProps}/>;
        }
    }

    return i18nWrapper;
};

export {
    i18nWrapper
}
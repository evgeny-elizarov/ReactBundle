import React from 'react';
import { windowsStore } from '@AndevisReactBundle/UI/Stores';
import PropTypes from "prop-types";

class Window extends React.Component {

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onClose: PropTypes.func,
        footerContent: PropTypes.any,
        title: PropTypes.string,
        left: PropTypes.number,
        top: PropTypes.number,
        width: PropTypes.string,
        height: PropTypes.string,
        children: PropTypes.node
    };

    // // TODO: by default put window on center of the page
    static defaultProps = {
        isOpen: true,
    };

    createWindow(){
        this.window = windowsStore.newWindow(this.props);
    }

    closeWindow(){
        if(this.props.onClose) this.props.onClose();
        if(this.window) {
            windowsStore.removeWindow(this.window);
        }
    }

    componentWillMount(){
        if(this.props.isOpen){
            this.createWindow();
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.isOpen && !this.window){
            this.createWindow();
        }
        if(!nextProps.isOpen){
            this.closeWindow();
        }
    }

    componentWillUnmount() {
        this.closeWindow();
    }

    render(){
        return (<div>Here window</div>);
    }
}

export {
    Window
}
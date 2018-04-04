import React from 'react';
import Component from "@AndevisReactBundle/UI/ComponentBase/Component";
import PropTypes from "@AndevisReactBundle/prop-types";

export default class Container extends Component {

    static propTypes = Object.assign({}, Component.propTypes, {
        content: PropTypes.func,
    });

    getBundleName(){
        return 'React';
    }

    render(){
        return (typeof this.props.content === 'function') ? this.props.content(this.props, this.state) : this.props.content;
    }
}
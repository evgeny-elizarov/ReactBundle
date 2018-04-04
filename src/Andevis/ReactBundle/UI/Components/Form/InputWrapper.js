import React from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";

const Tooltip = ({ styleClass, message, show }) => (
    <div
        className={classNames("tooltip fade bottom in", styleClass)}
        style={{display: show ? 'block' : 'none'}}
        role="tooltip">
        <div className="tooltip-arrow" style={{left: "50%"}} />
        <div className="tooltip-inner">{message}</div>
    </div>
);

export default class InputWrapper extends React.Component
{
    static propTypes = {
        error: PropTypes.string,
        warning: PropTypes.string,
        success: PropTypes.string,
        hasFocus: PropTypes.bool,
        helpText: PropTypes.string,
        className: PropTypes.any,
        style: PropTypes.object
    };

    static contextTypes =  {
        fieldApi: PropTypes.object,
    };

    render(){
        const fieldApi  = this.context.fieldApi;

        const hasError = (this.props.error);
        const hasWarning = (!this.props.error && this.props.warning);
        const hasSuccess = (!this.props.error && !this.props.warning && this.props.success);

        // TODO: rename form-input to form-field
        // TODO: form-component remove if not need
        return (
            <div className={classNames(this.props.className, {
                "has-error": hasError,
                "has-warning": hasWarning,
                "has-success": hasSuccess,
            })} style={this.props.style}>
                {this.props.children}
                {hasError && (<Tooltip styleClass="danger" message={this.props.error} show={this.props.hasFocus}/>)}
                {hasWarning ? <Tooltip styleClass="warning" message={this.props.warning} show={this.props.hasFocus}/> : null}
                {hasSuccess ? <Tooltip styleClass="success" message={this.props.success} show={this.props.hasFocus}/> : null}
                {this.props.helpText && <p className="help-block">{this.props.helpText}</p>}
            </div>
        );
    }
}

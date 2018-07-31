import React from 'react';
import PropTypes from 'prop-types';
import messages from './messages';
import { i18n } from "@AndevisReactBundle/UI/Translation";
import MsgBox from "@AndevisReactBundle/UI/Components/MsgBox/helpers";
import { autobind } from "core-decorators";
import './MsgBox.scss';

class MsgBoxBody extends React.Component {

    static propTypes = {
        icon: PropTypes.string,
        message: PropTypes.string,
        resolveCallback: PropTypes.func
    };

    render(){
        const icon = this.props.icon;
        return (
            <div className="panel-body msg-box">
                {icon && <em className="icon" />}{this.props.message}
            </div>
        )
    }
}

class MsgBoxButtons extends React.Component {

    static propTypes = {
        buttonType: PropTypes.number,
        resolveCallback: PropTypes.func
    };

    static contextTypes = {
        window: PropTypes.object.isRequired
    };

    @autobind
    handleResolve(result){
        if(this.props.resolveCallback){
            this.props.resolveCallback(result);
        }
        if(this.context.window){
            this.context.window.close();
        }
    }

    componentDidMount(){
        this.refs.primaryButton.focus();
    }

    render() {

        switch (this.props.buttonType) {

            // YES or NO
            case MsgBox.Type.YesNo:
                return (
                    <div className="pull-right btn-group">
                        <button
                            ref="primaryButton"
                            className="btn btn-primary"
                            onClick={() => {
                                this.handleResolve(MsgBox.Result.Yes);
                            }}>{i18n(messages.Yes)}</button>
                        <button
                            className="btn btn-default"
                            onClick={() => {
                                this.handleResolve(MsgBox.Result.No);
                            }}>{i18n(messages.No)}</button>
                    </div>
                );
                break;

            // YES, NO, Cancel
            case MsgBox.Type.YesNoCancel:
                return (
                    <div className="pull-right btn-group">
                        <button
                            ref="primaryButton"
                            className="btn btn-primary"
                            onClick={() => {
                                this.handleResolve(MsgBox.Result.Yes);
                            }}>{i18n(messages.Yes)}</button>
                        <button
                            className="btn btn-default"
                            onClick={() => {
                                this.handleResolve(MsgBox.Result.No);
                            }}>{i18n(messages.No)}</button>
                        <button
                            className="btn btn-default"
                            onClick={() => {
                                this.handleResolve(MsgBox.Result.Cancel);
                            }}>{i18n(messages.Cancel)}</button>
                    </div>
                );
                break;

            // OK or Cancel
            case MsgBox.Type.OKCancel:
                return (
                    <div className="pull-right btn-group">
                        <button
                            ref="primaryButton"
                            className="btn btn-primary"
                            onClick={() => {
                                this.handleResolve(MsgBox.Result.OK);
                            }}>{i18n(messages.OK)}</button>
                        <button
                            className="btn btn-default"
                            onClick={() => {
                                this.handleResolve(MsgBox.Result.Cancel);
                            }}>{i18n(messages.Cancel)}</button>
                    </div>
                );
                break;

            // ARetry or Cancel
            case MsgBox.Type.RetryCancel:
                return (
                    <div className="pull-right btn-group">
                        <button
                            ref="primaryButton"
                            className="btn btn-primary"
                            onClick={() => {
                                this.handleResolve(MsgBox.Result.Retry);
                            }}>{i18n(messages.Retry)}</button>

                        <button
                            className="btn btn-default"
                            onClick={() => {
                                this.handleResolve(MsgBox.Result.Cancel);
                            }}>{i18n(messages.Cancel)}</button>
                    </div>
                );
                break;

            // Abort, Retry or Ignore
            case MsgBox.Type.AbortRetryIgnore:
                return (
                    <div className="pull-right btn-group">
                        <button
                            ref="primaryButton"
                            className="btn btn-primary"
                            onClick={() => {
                                this.handleResolve(MsgBox.Result.Abort);
                            }}>{i18n(messages.Abort)}</button>

                        <button
                            className="btn btn-default"
                            onClick={() => {
                                this.handleResolve(MsgBox.Result.Retry);
                            }}>{i18n(messages.Retry)}</button>

                        <button
                            className="btn btn-default"
                            onClick={() => {
                                this.handleResolve(MsgBox.Result.Ignore);
                            }}>{i18n(messages.Ignore)}</button>
                    </div>
                );
                break;

            // OK
            case MsgBox.Type.OKOnly:
            default:
                return (
                    <div className="pull-right">
                        <button
                            ref="primaryButton"
                            className="btn btn-default" onClick={() => {
                                this.handleResolve(MsgBox.Result.OK);
                            }}>{i18n(messages.OK)}</button>
                    </div>
                );
        }
    }
}


export {
    MsgBoxBody,
    MsgBoxButtons
}

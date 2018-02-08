import React from 'react';
import html from 'react-escape-html';
import PropTypes from 'prop-types';
import { translatable } from "./../../decorators/i18n";
import JqxWindow from './../../vendors/jqwidgets-react/react_jqxwindow';
//import Button from "./../../Components/widgets/Button";
import Button from "./../../Components/Button";
import { systemMessages } from "./../../Stores";
import { filterObjectByKeys } from "../../Helpers/base";
import $ from 'jquery';

import './MsgBox.css';

// const $ = window.$;

const MsgBoxStyle  = {
    OKOnly: 0,
    YesNo: 4,
    Critical: 16,
    ErrorModal: 1, // Application is modal. The user must respond to the message box before continuing work in the current application.
};

const MsgBoxResult = {
    OK: 1,
    Cancel: 2,
    Abort: 3,
    Retry: 4,
    Ignore: 5,
    Yes: 6,
    No: 7
};

const NEXT_WINDOW_OFFSET = 10;
const SIZE_FACTOR = 0.25;

@translatable('MsgBox')
class MsgBox extends React.Component
{
    static propTypes = {
        title: PropTypes.string,
        theme: PropTypes.string,
        showAnimationDuration: PropTypes.number,
        message: PropTypes.object.isRequired,
        onClose: PropTypes.func,
        maxHeight: PropTypes.number,
        maxWidth: PropTypes.number,
        minHeight: PropTypes.number,
        minWidth: PropTypes.number,
        width: PropTypes.any,
        height: PropTypes.any,
        modalOpacity: PropTypes.any
    };

    static defaultProps = {
        title: "Modal message",
        theme: "bootstrap",
        maxWidth: $(window).width(),
        maxHeight: $(window).height(),
        minWidth: 250,
        minHeight: 150,
        showAnimationDuration: 100,
        width: 'auto',
        height: 'auto',
        modalOpacity: 0.9
    };

    /**
     * Close box
     * @param result
     */
    actionClick(result){
        if(this.refs.eventWindow){
            this.refs.eventWindow.close();
            if(this.props.message.callback)
                this.props.message.callback(result);
        }
    }

    /**
     * Close box
     */
    onCloseEvent(){
        systemMessages.removeMessage(this.props.message);
    }

    /**
     * Get next window coordinates
     * @param w
     * @param h
     * @returns {{top: number, left: number}}
     */
    getNextCoordinates(w, h){
        let top = (($(window).height() / 3) - (h / 2)) + (systemMessages.poll.length * NEXT_WINDOW_OFFSET);
        let left = (($(window).width() / 2) - (w / 2)) + (systemMessages.poll.length * NEXT_WINDOW_OFFSET);
        return {
            top: top,
            left: left
        }
    }

    getWidth(){
        return $(this.refs.eventWindow.componentSelector).jqxWindow('width');
    }

    setWidth(width){
        return $(this.refs.eventWindow.componentSelector).jqxWindow({ 'width' : width });
    }

    getHeight(){
        return $(this.refs.eventWindow.componentSelector).jqxWindow('height');
    }

    setHeight(height) {
        return $(this.refs.eventWindow.componentSelector).jqxWindow({ 'height' : height });
    }

    getWindowRectSize(){
        return {
            width: $(this.refs.eventWindow.componentSelector).outerWidth(),
            height: $(this.refs.eventWindow.componentSelector).outerHeight(),
        };
    }

    getBodyRectSize(){
        return {
            width: $(this.refs.eventWindow.componentSelector + ' .MsgBox-body > .content').outerWidth(),
            height: $(this.refs.eventWindow.componentSelector + ' .MsgBox-body > .content').outerHeight(),
        };
    }

    getHeaderRectSize(){
        return {
            width: $(this.refs.eventWindow.componentSelector + ' .MsgBox-header').outerWidth(),
            height: $(this.refs.eventWindow.componentSelector + ' .MsgBox-header').outerHeight(),
        };
    }

    componentDidMount(){
        this.refs.eventWindow.on('close', () => {
            this.onCloseEvent();
            if(this.props.message.callback)
                this.props.message.callback(MsgBoxResult.Cancel);
        });

        // Auto resize
        const wndSize = this.getWindowRectSize();
        let wndW = wndSize.width;
        let wndH = wndSize.height;
        if(this.props.width == 'auto' && this.props.height == 'auto'){
            const avrSize = ( wndSize.width + wndSize.height ) / 2;
            const wndFactor = $(window).width() /  $(window).height();
            wndW = avrSize * wndFactor;
            wndH = avrSize / wndFactor;
            if(wndW > this.props.maxWidth) wndW = this.props.maxWidth;
            if(wndH > this.props.maxHeight) wndH = this.props.maxHeight;
            if(wndW < this.props.minWidth) wndW = this.props.minWidth;
            if(wndH < this.props.minHeight) wndH = this.props.minHeight;

            this.setWidth(wndW);
            this.setHeight(wndH);

        }

        // Move window to center
        const nextPosition = this.getNextCoordinates(wndW, wndH);
        this.refs.eventWindow.move(nextPosition.left, nextPosition.top);

        // Show window
        this.refs.eventWindow.open();
    }

    render()
    {
        let offset = { left: 40, top: 95 };
        const message = this.props.message;

        // Message
        let safeHTMLString = html`${message.message}`;
        let safeMessage = <div dangerouslySetInnerHTML={safeHTMLString} />;

        // Style
        let JqxProps = filterObjectByKeys(this.props, [
            'theme',
            'showAnimationDuration',
            'maxHeight',
            'maxWidth',
            'minHeight',
            'minWidth'
        ]);
        let buttons = '';
        let iconClass = '';
        switch (message.style)
        {
            case MsgBoxStyle.YesNo:
                buttons = (
                    <div>
                        <Button
                            value={this.i18n('Yes')}
                            onClick={() => {
                                this.actionClick(MsgBoxResult.Yes);
                            }}
                            style={{ display: 'inline-block', marginRight: 10 }}
                        />
                        <Button
                            value={this.i18n('No')}
                            onClick={() => {
                                this.actionClick(MsgBoxResult.No);
                            }}
                            style={{ display: 'inline-block' }}
                        />
                    </div>
                );
                break;

            case MsgBoxStyle.Critical:
                iconClass = 'icon icon-critical-15';
                JqxProps['resizable'] = true;
                JqxProps['isModal'] = true;
                buttons = (
                    <Button  value={this.i18n('OK')} onClick={() => {
                        this.actionClick(MsgBoxResult.OK);
                    }} />
                );
                break;

            default:
                buttons = (
                    <Button  value={this.i18n('OK')} onClick={() => {
                        this.actionClick(MsgBoxResult.OK);
                    }} />
                );
                break;
        }

        return (
            <div>
                <JqxWindow
                    ref='eventWindow'
                    className="MsgBox"
                    autoOpen={false}
                    {...JqxProps}>
                    <div className="MsgBox-header">
                        { iconClass && <em className={iconClass} /> } {message.title}
                    </div>
                    <div className="MsgBox-body">
                        <div className="content">
                            {safeMessage}
                            <div className={'text-center clearfix'}>
                                <span style={{display: 'inline-block'}}>{buttons}</span>
                            </div>
                        </div>
                    </div>
                </JqxWindow>
            </div>
        )
    }
}


export {
    MsgBox,
    MsgBoxStyle,
    MsgBoxResult
}
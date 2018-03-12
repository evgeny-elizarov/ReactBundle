import React from 'react';
import createWindow from './../Windows';
import messages from './messages';
import { i18n } from "@AndevisReactBundle/UI/Translation";
import { MsgBoxBody, MsgBoxButtons } from './MsgBox';

/**
 * Create message box
 * @param message
 * @param type
 * @param title
 * @constructor
 */
function MsgBox(message, type, title) {

    if(!title) title = i18n(messages.msgBoxDefaultTitle);

    // Button type
    const buttonType = type % 16;

    // is modal
    const isModal = (type & MsgBox.Type.SystemModal) ? true : false;

    // Style
    let style = null;
    let styleType = type % 256;

    if((styleType & MsgBox.Type.Information)) {
        style = 'information';
    } else if((styleType & MsgBox.Type.Exclamation)) {
        style = 'exclamation';
    } else if((styleType & MsgBox.Type.Question)) {
        style = 'question';
    } else if((styleType & MsgBox.Type.Critical)){
        style = 'critical';
    }

    return new Promise(function(resolve) {
        createWindow(
            title,
            <MsgBoxBody message={message} icon={style} type={type}/>, {
                modal: isModal,
                centred: true,
                className: style,
                closable: false,
                customClose: (window) => {
                    resolve(MsgBox.Result.Cancel);
                    window.close();
                },
                footerContent: <MsgBoxButtons
                    message={message}
                    buttonType={buttonType}
                    resolveCallback={resolve}
                />
            });
    });
}

MsgBox.Type  = {
    OKOnly: 0,
    OKCancel: 1,
    AbortRetryIgnore: 2,
    YesNoCancel: 3,
    YesNo: 4,
    RetryCancel: 5,
    Critical: 16,
    Question: 32,
    Exclamation: 64,
    Information: 128,
    SystemModal: 4096, // Application is modal. The user must respond to the message box before continuing work in the current application.
};

MsgBox.Result = {
    OK: 1,
    Cancel: 2,
    Abort: 3,
    Retry: 4,
    Ignore: 5,
    Yes: 6,
    No: 7
};


export default MsgBox;

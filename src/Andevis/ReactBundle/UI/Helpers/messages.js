import { systemMessages } from "./../Stores";
// TODO: refactor message box
import { MsgBoxStyle, MsgBoxResult } from './../Components/messages/MsgBox';



/**
 * Show system message box
 * @param message
 * @param style
 * @param title
 * @param callback
 */
function MsgBox(message, style = MsgBoxStyle.OKOnly, title = "Message", callback)
{
    systemMessages.newMessage(message, style, title, callback);
}

/**
 * Critical error message
 * @param message
 * @param callback
 * @param title
 * @constructor
 */
function CriticalErrorMessage(message, title = null, callback) {
    if(!title) title = "Critical error";
    MsgBox(message, MsgBoxStyle.Critical, title, callback);
}


export {
    CriticalErrorMessage,
    MsgBox,
    MsgBoxStyle,
    MsgBoxResult
};
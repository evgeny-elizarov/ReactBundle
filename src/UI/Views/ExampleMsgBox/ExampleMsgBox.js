import React from 'react';
import Button from "@AndevisReactBundle/UI/Components/Button/Button";
import MsgBox from "@AndevisReactBundle/UI/Components/MsgBox";
import ExampleBaseView from "@AndevisReactBundle/UI/Views/ExampleBaseView";

export default class ExampleMsgBox extends ExampleBaseView {

    static bundleName = 'React';

    handleMsgBoxResult(result){
        switch (result){
            case MsgBox.Result.OK:
                alert('OK clicked');
                break;

            case MsgBox.Result.Cancel:
                alert('Cancel clicked');
                break;

            case MsgBox.Result.Yes:
                alert('Yes clicked');
                break;

            case MsgBox.Result.No:
                alert('No clicked');
                break;

            case MsgBox.Result.Abort:
                alert('Abort clicked');
                break;

            case MsgBox.Result.Retry:
                alert('Retry clicked');
                break;

            case MsgBox.Result.Ignore:
                alert('Ignore clicked');
                break;

            default:
                alert('Other clicked');
        }
    }

    render(){
        return (
            <div className="container">
                <div className="page-header">
                    <h1>MsgBox example</h1>
                </div>
                <Button
                    onClick={() => {
                        MsgBox('Simple message').then(this.handleMsgBoxResult);
                    }}>Show simple message</Button>

                <Button
                    onClick={() => {
                        MsgBox(
                            'Simple modal message',
                            MsgBox.Type.OKOnly | MsgBox.Type.SystemModal)
                            .then(this.handleMsgBoxResult);
                    }}>Show simple modal message</Button>

                <Button
                    onClick={() => {
                        MsgBox('Critical', MsgBox.Type.YesNo | MsgBox.Type.Critical);
                        MsgBox('Question', MsgBox.Type.OKOnly | MsgBox.Type.Question);
                        MsgBox('Exclamation', MsgBox.Type.OKOnly | MsgBox.Type.Exclamation);
                        MsgBox('Information', MsgBox.Type.OKOnly | MsgBox.Type.Information);
                    }}>Show messages with icons</Button>

                <Button
                    onClick={() => {
                        MsgBox('Choice OK or Cancel', MsgBox.Type.OKCancel)
                            .then(this.handleMsgBoxResult);
                    }}>Choice OK or Cancel</Button>

                <Button
                    onClick={() => {
                        MsgBox('Choice Yes or No', MsgBox.Type.YesNo, 'Choice')
                            .then(this.handleMsgBoxResult);
                    }}>Choice Yes or No</Button>

                <Button
                    onClick={() => {
                        MsgBox('Choice Yes, No, Cancel', MsgBox.Type.YesNoCancel, 'Choice')
                            .then(this.handleMsgBoxResult);
                    }}>Choice Yes, No, Cancel</Button>

                <Button
                    onClick={() => {
                        MsgBox('Choice Retry or Cancel', MsgBox.Type.RetryCancel)
                            .then(this.handleMsgBoxResult);
                    }}>Choice Retry or Ignore</Button>

                <Button
                    onClick={() => {
                        MsgBox('Choice Abort, Retry or Ignore', MsgBox.Type.AbortRetryIgnore)
                            .then(this.handleMsgBoxResult);
                    }}>Choice Abort, Retry or Ignore</Button>
            </div>
        )
    }
}

import React from 'react';
import {observer} from 'mobx-react';
import { MsgBox } from "./MsgBox";
import { systemMessages } from './../../Stores';

@observer
export default class SystemMessages extends React.Component
{
    render() {
        return (
            <div>
                { systemMessages.poll.map((message, i) => (<MsgBox key={message.id} message={message} />))}
            </div>
        );
    }
}
import { observable, computed, action, extendObservable } from "mobx";

class Message {
    id = null;
    @observable title = "";
    @observable message = "";
    @observable style = 0;
    callback = null;

    constructor(message, style, title, callback){
        extendObservable(this, {
            id: Math.random(),
            message: message,
            style: style,
            title: title,
            callback: callback
        });
    }
}



class MessagePoll {
    @observable poll = [];

    @computed get lastMessage() {
        return this.poll[this.poll.length-1];
    }

    @action('new message')
    newMessage(message, style, title, callback) {
        this.poll.push(
            new Message(message, style, title, callback),
        );
    }

    @action('remove message')
    removeMessage(message) {
        const i = this.poll.indexOf(message);
        this.poll.splice(i, 1);
    }

    @action('remove last message')
    removeLastMessage(){
        this.poll.pop();
    }

}

export {
    MessagePoll,
    Message
}
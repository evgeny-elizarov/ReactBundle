import { observable, computed, action, extendObservable } from "mobx";
import { guid } from '@AndevisReactBundle/UI/Helpers';


class WindowModel {
    id = null;

    @observable content;
    @observable refreshCount = 0;
    @observable title = null;
    @observable left = 0;
    @observable top = 0;
    @observable width = 'auto';
    @observable height = 'auto';
    @observable modal = false;
    @observable zIndex = WindowsStore.MAX_Z_INDEX;
    @observable closable = true;
    customClose = null;


    constructor(content, props) {

        let finalProps = Object.assign({}, {
            left: 0,
            top: 0,
            width: 'auto',
            height: 'auto',
            zIndex: WindowsStore.MAX_Z_INDEX,
            modal: false,
            content: content,
            closable: true
        }, props);

        finalProps.id = guid();
        extendObservable(this, finalProps);
    }

    @action('window move')
    move(left, top){
        this.left = left;
        this.top = top;
        this.bringToFront();
    }

    @action('brint to top')
    bringToFront(){
        if(this.zIndex <= WindowsStore.MAX_Z_INDEX){
            this.zIndex = WindowsStore.MAX_Z_INDEX + 1;
            WindowsStore.MAX_Z_INDEX = this.zIndex;
        }
    }
}


class WindowsStore {

    static NEXT_WINDOW_OFFSET = 50;
    static MAX_Z_INDEX = 10000;

    @observable poll = [];

    get windowsCount(){
        return this.poll.length;
    }

    getPoll(){
        return this.poll;
    }

    getWindowById(id){
        for (let i = 0; i < this.poll.length; i++) {
            if (this.poll[i].id === id) {
                return this.poll[i];
            }
        }
    }

    @action('new window')
    addWindow(content, props) {
        if(!props.hasOwnProperty('left') && !props.hasOwnProperty('top')){
            props.left = 50 * WindowsStore.NEXT_WINDOW_OFFSET;
            props.top = 50 * WindowsStore.NEXT_WINDOW_OFFSET;
        }
        const windowModel = new WindowModel(content, props);
        this.poll.push(windowModel);
        return windowModel;
    }

    @action('remove window')
    removeWindow(windowModel) {
        const i = this.poll.indexOf(windowModel);
        this.poll.splice(i, 1);
    }

    @computed get lastWindow() {
        return this.poll[this.poll.length-1];
    }

    @action('remove last window')
    removeLastWindow(){
        this.poll.pop();
    }

}


export {
    WindowsStore,
    WindowModel
}
import { observable, computed, action, extendObservable } from "mobx";

// function guid() {
//     function s4() {
//         return Math.floor((1 + Math.random()) * 0x10000)
//             .toString(16)
//             .substring(1);
//     }
//     return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
// }
//

class WindowsStore {

    static maxZIndex = 10000;

    @observable poll = [];

    @computed get lastWindow() {
        return this.poll[this.poll.length-1];
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
    newWindow(component) {
        const windowStore = new WindowStore(component, this.poll.length);
        this.poll.push(windowStore);
        return windowStore;
    }

    @action('remove window')
    removeWindow(window) {
        const i = this.poll.indexOf(window);
        this.poll.splice(i, 1);
    }

    @action('remove last window')
    removeLastWindow(){
        this.poll.pop();
    }

}

class WindowStore {
    id = "";
    component = null;
    modal = false;

    @observable refreshCount = 0;
    @observable title = "";
    @observable left = 0;
    @observable top = 0;
    @observable width = 'auto';
    @observable height = 'auto';
    @observable zIndex = WindowsStore.maxZIndex;
    @observable visible = true;

    constructor(component, index) {
        const { left, top, width, height, zIndex, visible, modal } = component.props;
        console.log(component.title);
        extendObservable(this, {
            component: component,
            id: component.id,
            title: component.title,
            left: left ? left : 50 * index,
            top: top ? top : 50 * index,
            width: width ? width : 'auto',
            height: height ? width : 'auto',
            zIndex: zIndex ? zIndex : WindowsStore.maxZIndex,
            visible: visible ? visible : true,
            modal: modal ? modal : false
        });
        console.log("Window create", this);
    }

    @action('refresh')
    refresh(){
        // Fix refresh
        this.refreshCount += 1;
    }

    setState(state){
        extendObservable(this, state);
    }

    @action('window move')
    move(left, top){
        console.log("Move ", left, top);
        this.left = left;
        this.top = top;
        this.setMaxZIndex();

    }

    @action('set max index')
    setMaxZIndex(){
        if(this.zIndex <= WindowsStore.maxZIndex){
            this.zIndex = WindowsStore.maxZIndex + 1;
            WindowsStore.maxZIndex = this.zIndex;
        }
    }
}



export {
    WindowsStore,
    WindowStore
}
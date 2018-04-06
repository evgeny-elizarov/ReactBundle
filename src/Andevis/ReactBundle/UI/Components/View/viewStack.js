
class ViewStack {

    constructor() {
        this.stackByName = {};
    }

    /**
     * Register view
     */
    register(view){
        this.stackByName[view.getBundleName() + ":" + view.getName()] = view;
    }

    /**
     * Unregister view
     */
    unregister(view){
        delete this.stackByName[view.getBundleName() + ":" + view.getName()];
    }

    /**
     * Get registered view by glboal name (BundleName:ViewName)
     */
    getByGlobalName(viewGlobalName){
        if(this.stackByName.hasOwnProperty(viewGlobalName))
        {
            return this.stackByName[viewGlobalName];
        }
    }
}

const viewStack = new ViewStack();

export default viewStack;

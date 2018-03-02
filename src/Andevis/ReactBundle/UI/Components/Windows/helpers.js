import { windowsStore } from "@AndevisReactBundle/UI/Stores";


function createWindow(props) {
    windowsStore.newWindow(props);
}

export default createWindow;
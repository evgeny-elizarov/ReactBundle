import { windowsStore } from "@AndevisReactBundle/UI/Stores";

const NEXT_WINDOW_OFFSET = 50;

/**
 * Create new window
 * @param title
 * @param content
 * @param props
 */
function createWindow(title, content, props) {

    const nextWindowOffset = windowsStore.windowsCount * NEXT_WINDOW_OFFSET;

    let finalProps = Object.assign({}, {
        title: title,
        left: nextWindowOffset,
        top: nextWindowOffset
    }, props);
    return windowsStore.addWindow(content, finalProps);

}

export default createWindow;
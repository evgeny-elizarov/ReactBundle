import { autobind } from './decorators';

class HotKeysRegister {

    constructor() {
        this.state = {};
        this.subscriptions = [];

        // Регистрируем кноки клавиатуры
        window.addEventListener('keydown', this.handleKeyDownEvent);
    }

    /**
     * Register hot key
     * @param hotKey
     * @param handler
     * @return {number}
     */
    registerHotKey(hotKey, handler){
        const subs = {
            handler: handler,
            hotKey: this.parseHotKeyProp(hotKey)
        };
        this.subscriptions.push(subs);
        return this.subscriptions.lastIndexOf(subs);
    }

    /**
     * Unregister hot key
     * @param subsIndex
     */
    unregisterHotKey(subsIndex){
        delete this.subscriptions[subsIndex];
    }

    /**
     * Key down handler
     * @param event
     */
    @autobind
    handleKeyDownEvent(event){
        if(this.subscriptions.length > 0)
        {
            this.subscriptions.forEach((subs) => {
                if(
                    subs.hotKey.key == event.key &&
                    subs.hotKey.altKey == event.altKey &&
                    subs.hotKey.shiftKey == event.shiftKey &&
                    subs.hotKey.ctrlKey == event.ctrlKey
                ) {
                    event.preventDefault();
                    subs.handler(event);
                }
            });
            const keyName = event.key;
        }
    }

    /**
     * Parse HotKey string
     * @param value
     */
    parseHotKeyProp(hotKeyString){
        let hotKey = null;
        const keys = hotKeyString.split("+").map(key => key.trim(), 2);
        if(keys.length > 0)
        {
            hotKey = {
                altKey: false,
                shiftKey: false,
                ctrlKey: false
            };
            keys.forEach((key) => {
                switch (key.toLowerCase())
                {
                    case 'alt':
                        hotKey['altKey'] = true;
                        break;

                    case 'shift':
                        hotKey['shiftKey'] = true;
                        break;

                    case 'ctrl':
                    case 'control':
                        hotKey['ctrlKey'] = true;
                        break;

                    default:
                        hotKey['key'] = key;
                }
            });
        }
        return hotKey;
    }
}

const hotKeys = new HotKeysRegister();

export default hotKeys;
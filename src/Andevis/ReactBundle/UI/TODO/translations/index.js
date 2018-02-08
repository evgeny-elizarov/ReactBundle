/**
 * Created by EvgenijE on 08.09.2017.
 */
import et_local from './et';
import et_common from './common.et';
import ru_local from './ru';
import ru_common from './common.ru';

const commonMessages = {
    et: et_common,
    ru: ru_common
};
const localMessages = {
    et: et_local,
    ru: ru_local
};


function getLocaleMessages(locale){
    let combinedMessages = [];
    const messagesLn = localMessages[locale];
    const commonMessagesLn = commonMessages[locale]; // common
    for(let key in messagesLn) {
        if(messagesLn.hasOwnProperty(key)) {
            combinedMessages['LOCAL.'+key+''] = messagesLn[key];
        }
    }
    for(let key in commonMessagesLn) {
        if(commonMessagesLn.hasOwnProperty(key)) {
            combinedMessages['COMMON.'+key+''] = commonMessagesLn[key];
        }
    }
    return Object.assign({}, combinedMessages);
}


export {
    commonMessages,
    localMessages,
    getLocaleMessages
};

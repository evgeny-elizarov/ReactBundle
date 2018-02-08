/**
 * Created by EvgenijE on 26.09.2017.
 */
/**
 * Filter object by keys
 * @param object
 * @param filterKeys array
 */
function filterObjectByKeys(object, filterKeys = []) {
    let newObject = {};
    filterKeys.forEach((key) => {
        if (object.hasOwnProperty(key)) {
            newObject[key] = object[key];
        }
    });
    return newObject;
}

export {
    filterObjectByKeys,
}

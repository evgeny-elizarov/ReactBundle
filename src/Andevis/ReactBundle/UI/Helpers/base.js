
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

/**
 * Assign class props
 * @param object
 * @param props
 */
function assignClassProps(object, props) {
    if (typeof props !== 'undefined') {
        for (let key in object) {
            if (props.hasOwnProperty(key)) object[key] = props[key];
        }
    }
}

/**
 * Use JSON.stringify with a custom replacer. Stringify circular structure
 */
function ComponentDataToJsonString(obj){
    let cache = [];
    const string = JSON.stringify(obj, function(key, value) {
        if( typeof value === 'function') {
            return '[func]';
        }
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null;
    return string;
}

export {
    assignClassProps,
    filterObjectByKeys,
    ComponentDataToJsonString
}

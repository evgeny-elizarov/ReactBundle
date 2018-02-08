/**
 * Lower case first char
 * @param str
 * @returns {string}
 */
function lcfirst (str) {
    str += '';
    let f = str.charAt(0).toLowerCase();
    return f + str.substr(1)
}

/**
 * Upper case first char
 * @param str
 * @returns {string}
 */
function ucfirst (str) {
    str += '';
    let f = str.charAt(0).toUpperCase();
    return f + str.substr(1)
}

export {
    lcfirst,
    ucfirst
}

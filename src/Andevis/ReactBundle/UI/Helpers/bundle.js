let bundles = {};

const setBundle = (bundleName, module) => {
    bundles[bundleName] = module;
};
const getBundle = (bundleName) => {
    if(bundles && bundles.hasOwnProperty(bundleName)){
        return bundles[bundleName];
    } else {
        throw new Error('Bundle `'+bundleName+'` not set!');
    }
};

export {
    setBundle,
    getBundle
};
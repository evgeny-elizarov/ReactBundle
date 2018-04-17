let bundles = {};

const setBundleRoutes = (bundleName, module) => {
    bundles[bundleName] = module;
};
const getBundleRoutes = (bundleName) => {
    if(bundles && bundles.hasOwnProperty(bundleName)){
        return bundles[bundleName];
    } else {
        throw new Error('Bundle `'+bundleName+'` not set!');
    }
};

export {
    setBundleRoutes,
    getBundleRoutes
};
module.exports = run;

run.$inject = [
    '$templateCache'
];
function run($templateCache) {
    // TODO don't use "$rootScope"
    //$rootScope.Shared = {
    //    serviceBase: metadata.serviceBase,
    //};

    cacheTemplates($templateCache);
}

function cacheTemplates($templateCache) {
    const requireContext = require.context('./modules', true, /\.*\.tpl\.html$/);

    requireContext.keys().forEach(function (modulePath) {
        const templateKey = modulePath.substr(2);
        const template = requireContext(modulePath);

        //console.log('====== template');
        //console.log(key);
        //console.log(templateKey);
        //console.log(template);

        $templateCache.put(templateKey, template);
    });
}

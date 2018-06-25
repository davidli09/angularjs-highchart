module.exports = config;

config.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
    'ScrollBarsProvider'
];
function config($stateProvider, $urlRouterProvider, ScrollBarsProvider) {
    const templateUrls = {
        headerP1: 'app/base-header-p1.tpl.html',
        headerP2: 'app/base-header-p2.tpl.html',
        footer: 'app/base-footer.tpl.html'
    };

    $urlRouterProvider.otherwise('/index');

    //const explorerComponentName = require('./modules/explorer/explorer.component').$name;
    //const explorerComponentTagName = require('_util').camelToDash(explorerComponentName);
    //const explorerComponentTemplate = `<${explorerComponentTagName} data="$resolve.mydata" ng-scrollbars></${explorerComponentTagName}>`;

    $stateProvider
        .state({
            name: 'index',
            url: '/index',
            views: {
                header: {
                    templateUrl: templateUrls.headerP1
                },
                content: {
                    component: require('./modules/prototype1/prototype1.component').$name
                },
                footer: {
                    templateUrl: templateUrls.footer
                }
            }
        })

    ScrollBarsProvider.defaults = {
        autoHideScrollbar: false,
        scrollInertia: 0,
        axis: 'y',
        advanced: {
            updateOnContentResize: true
        },
        scrollButtons: {
            scrollAmount: 'auto',
            enable: false
        }
    }
}

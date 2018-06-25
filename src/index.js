require('_styles/app/index.less');
console.log('running...');
var dependencies = [
    require('angular-animate'),
    require('angular-touch'),
    require('angular-sanitize'),

    // TODO switch to the NG2 Component Router v3 as soon as it's backported to the Angluar v1 (currently it's not)
    // http://victorsavkin.com/post/145672529346/angular-router#comment-2722270324
    'ui.router',

    require('angular-ui-bootstrap'),

    'nya.bootstrap.select',
    'angular.filter',
    'focusOn',
    'ngScrollbars',
    'highcharts-ng',

    require('./modules/common').name,
    require('./modules/app').name,
    require('./modules/prototype1').name,
    require('./modules/tiles').name,
];

module.exports = angular.module(`${require('_util').prefix}`, dependencies)
    .config(require('./config'))
    .run(require('./run'));

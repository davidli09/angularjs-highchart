var dependencies = [];

var component = require('./app.component');
var headerP1Directive = require('./header-p1.directive');
var headerP2Directive = require('./header-p2.directive');

module.exports = angular.module(`${require('_util').prefix}.app`, dependencies)
    .component(component.$name, component)
    .directive(headerP1Directive.$name, headerP1Directive)
    .directive(headerP2Directive.$name, headerP2Directive);

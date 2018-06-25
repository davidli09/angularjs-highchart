var dependencies = [];

var component = require('./prototype1.component');

const appCenterComponent = require('./app-center-component');
const appCenterDirective = require('./app-center-directive');
module.exports = angular.module(`${require('_util').prefix}.prototype1`, dependencies)
    .component(component.$name, component)
	.component(appCenterComponent.NAME, appCenterComponent)
    .directive(appCenterDirective.NAME, appCenterDirective);
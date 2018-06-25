var dependencies = [];

var tileContainerDirective = require('./tile-container.directive');
var tileDirective = require('./tile.directive');
var tileUnitDirective = require('./tile-unit.directive');

module.exports = angular.module(`${require('_util').prefix}.tiles`, dependencies)
    .directive(tileContainerDirective.$name, tileContainerDirective)
    .directive(tileDirective.$name, tileDirective)
    .directive(tileUnitDirective.$name, tileUnitDirective);

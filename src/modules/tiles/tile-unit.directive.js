require('./tile-unit.directive.less');

const attrs = require('_util').directiveAttrs(__filename);

directive.$name = attrs.$name;
directive.$inject = [];
function directive() {
    return {
        restrict: 'E',
        transclude: true,
        require: [
            `${require('./tile-unit.directive').$name}`,
            `^${require('./tile.directive').$name}`
        ],
        controller: require('./tile-unit.directive.controller'),
        controllerAs: attrs.controllerAs,
        bindToController: true,
        link (scope, el, attrs, [$ctrl, $ctrlTile], $transclude) {
            const newScope = scope.$new();
            $transclude(newScope, clonedEl => el.append(clonedEl));
            $ctrl.init(scope, el, $ctrlTile);
        }
    };
}

module.exports = directive;

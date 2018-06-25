require('./tile.directive.less');

const attrs = require('_util').directiveAttrs(__filename);

directive.$name = attrs.$name;
directive.$inject = [];
function directive() {
    return {
        restrict: 'E',
        transclude: true,
        require: [
            `${require('./tile.directive').$name}`,
            `?^${require('./tile-container.directive').$name}`
        ],
        controller: require('./tile.directive.controller'),
        controllerAs: attrs.controllerAs,
        bindToController: true,
        link (scope, el, attrs, [$ctrl, $ctrlContainer], $transclude) {
            const newScope = scope.$new();

            $transclude(newScope, clonedEl => el.append(clonedEl));

            if ($ctrlContainer) {
                $ctrl.init(scope, el, $ctrlContainer);
            }
        }
    };
}

module.exports = directive;

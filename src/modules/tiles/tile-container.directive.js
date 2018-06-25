require('./tile-container.directive.less');

const attrs = require('_util').directiveAttrs(__filename);

directive.$name = attrs.$name;
directive.$inject = [];
function directive() {
    return {
        restrict: 'E',
        transclude: true,
        require: `${require('./tile-container.directive').$name}`,
        template: `<items ng-transclude style="position: relative"></items>`,
        controller: require('./tile-container.directive.controller'),
        controllerAs: attrs.controllerAs,
        bindToController: true,
        scope: true,
        link (scope, el, attrs, $ctrl) {
            $ctrl.init(scope, el);
        }
    };
}

module.exports = directive;

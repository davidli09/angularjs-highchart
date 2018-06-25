require('./amount.directive.less');

const attrs = require('_util').directiveAttrs(__filename);

directive.$name = attrs.$name;
directive.$inject = [];
function directive() {
    return {
        restrict: 'E',
        transclude: {
            iconSlot: '?icon'
        },
        scope: {
            titleTop: '=',
            value: '=',
            currency: '=',
            titleBottom: '=',
            noRender: '=',  //Returns Without Rendering
            noDigit: '=',   //Returns Integer value without comma(,)
            withCurrencySymbol: '=',
            noZero: '='     //Returns Integer value with comma(,) separated
        },
        template: require('./amount.directive.html'),
        controller: require('./amount.directive.controller'),
        controllerAs: attrs.controllerAs,
        bindToController: true
        //link (scope, el, attrs, $ctrl, $transclude) {
        //    const newScope = scope.$new();
        //    $transclude.$$boundTransclude.$$slots.iconSlot(newScope, clonedEl => {
        //        el.append(clonedEl);
        //    });
        //}
    };
}

module.exports = directive;

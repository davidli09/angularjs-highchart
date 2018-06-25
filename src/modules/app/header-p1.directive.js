require('./header.directive.less');

const attrs = require('_util').directiveAttrs(__filename);

directive.$name = attrs.$name;
directive.$inject = [];
function directive() {
    return {
        restrict: 'E',
        require: `${require('./header-p1.directive').$name}`,
        template: require('./header-p1.directive.html'),
        controller: require('./header-p1.directive.controller'),
        controllerAs: attrs.controllerAs,
        bindToController: true
    };
}

module.exports = directive;

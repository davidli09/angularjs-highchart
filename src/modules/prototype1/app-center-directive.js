module.exports = directive;

directive.NAME = require('_util').prefix + 'AppCenter';
directive.$inject = [
    '$uibModal'
];
function directive($uibModal) {
    const modalConfig = {
        windowClass: `fade ${require('_util').prefix}-app-center-modal`,
        animation: false,
        template: require('./app-center-modal-controller.html'),
        size: 'md',
        controller: require('./../common/base-modal-controller'),
        controllerAs: '$ctrl',
        bindToController: true,

        resolve: {data: null}
    };

    return {
        restrict: 'A',
        scope: true,
        link: function (scope, el) {
            _.assign(scope, {
                click () {
                    $uibModal.open(modalConfig);
                }
            });

            el.on('click', scope.click.bind(scope));

            scope.$on('destroy', function () {
                el.off('click', scope.click);
            });
        }
    };
}

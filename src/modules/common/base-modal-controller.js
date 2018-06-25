module.exports = (class controller {
    static $inject = [
        'data',
        '$uibModalInstance',
        '$scope'
    ];

    constructor(data, $uibModalInstance, $scope) {
        this.$i = {$uibModalInstance, $scope};
        this.state = {data};
    }

    $onInit() {
        this.$i.$scope.$on(`${require('_util').prefix}-hide-wizard-request`, (event, data) => {
            this.$i.$scope.$applyAsync(() => {
                this.cancel();
            });
        });
    }

    cancel() {
        this.$i.$uibModalInstance.dismiss();
    }
});

module.exports = (class controller extends require('./../common/base-class-parent') {
    constructor() {
        super();
    }

    init($scope, el, $ctrlContainer) {
        Object.assign(this.$s, {
            el,
            $ctrlContainer,
            $maxColumns: () => $scope.$eval(el.attr('max-columns')) || Number.MAX_VALUE,
            $row: () => {
                const attr = el.attr('row');
                return _.isUndefined(attr) ? 1 : $scope.$eval(attr);
            },
            $size: () => {
                const size = this.$s.children.reduce((sum, unit) => sum + unit.$s.$size(), 0);
                return size;
            }
        });

        $ctrlContainer.initialized()
            .then(() => {
                $ctrlContainer.linkChild(this);
            });

        $scope.$on('destroy', () => {
            $ctrlContainer.unlinkChild(this);
            delete this.$s;
        });

        this.$s.initDefer.resolve();
    }
});

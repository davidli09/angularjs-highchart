module.exports = (class controller extends require('./../common/base-class') {
    constructor() {
        super();
    }

    init($scope, el, $ctrlTile) {
        Object.assign(this.$s, {
            el,
            $ctrlTile,
            $size: () => {
                let attr = el.attr('size');
                const iteration = this.$s.$ctrlTile.$s.$ctrlContainer.$s._initMatrix__iteration;

                if (iteration > 1) {
                    const dimensions = this.$s.dimensions;
                    const customColumnSizeAttr = dimensions && el.attr(`size-column-${dimensions.x}`);
                    attr = customColumnSizeAttr || el.attr('size');
                }

                return _.isUndefined(attr) ? 1 : $scope.$eval(attr);
            }
        });

        $ctrlTile.initialized()
            .then(() => {
                $ctrlTile.linkChild(this);
            });

        $scope.$on('destroy', () => {
            $ctrlTile.unlinkChild(this);
            delete this.$s;
        });
    }
});

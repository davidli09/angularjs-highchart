module.exports = (class controller {
    constructor($i) {
        this.$i = $i || {};
        this.$s = {};
    }

    linkDirective($s) {
        Object.assign(this.$s, $s);
        $s.$scope.$on('destroy', () => {
            delete this.$s;
        });
        this._linkDirectiveCallBack();
    }

    _linkDirectiveCallBack() {

    }
});

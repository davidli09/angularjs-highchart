module.exports = (class controller extends require('./../common/base-class') {
    constructor($i) {
        super($i);
        this.$s.children = [];
        this.$s.initDefer = {};
        this.$s.initDefer.promise = new Promise(resolve => this.$s.initDefer.resolve = resolve);
    }

    initialized() {
        return this.$s.initDefer.promise;
    }

    linkChild($ctrlChild) {
        this.$s.children.push($ctrlChild);
    }

    unlinkChild($ctrlChild) {
        _.remove(this.$s.children, $ctrlChild);
    }
});

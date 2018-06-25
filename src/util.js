module.exports = {
    prefix: 'sfpay',

    controllerAsPrefix: '$ctrl',

    componentAttrs (fileNameFull) {
        return this._attrs(fileNameFull, 'component');
    },

    directiveAttrs (fileNameFull) {
        return this._attrs(fileNameFull, 'directive');
    },

    controllerAttrs (fileNameFull) {
        return this._attrs(fileNameFull, 'controller');
    },

    _attrs (fileNameFull, entityName) {
        const fileName = fileNameFull.split('/').pop();
        const fileNameResult = fileName.replace(new RegExp(`[\/]?(.*)(.${entityName}.js$)`), '$1');
        const $name = this.dashToCamel(`${module.exports.prefix}-${fileNameResult}`);
        const controllerAs = this.dashToCamel(`${this.controllerAsPrefix}-${fileNameResult}`);

        return {$name, controllerAs};
    },

    dashToCamel: (str) => str.replace(/-([a-z])/g, g => g[1].toUpperCase()),

    camelToDash: (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),

    linkDirective($s) {
        Object.assign(this.$s, $s);
        $s.$scope.$on('destroy', () => {
            delete this.$s;
        });
        this._linkDirectiveCallBack();
    },

    _linkDirectiveCallBack() {

    }
};

module.exports = (class controller extends require('./../common/base-class') {
    const CURRENCY_DEFAULT = 'usd';

    static $inject = [
        '$filter'
    ];

    constructor($filter) {
        super({$filter});
    }

    renderValue() {
        var value;
        if(this.noDigit) value = Math.round(this.value);
        else if(this.noRender) value = this.value.toFixed(2); 
        else if(this.noZero) value = this.$i.$filter('number')(this.value, 0);
        else value = _.isUndefined(this.currency) ? this.$i.$filter('number')(this.value, 2) : this.value;
        if(this.withCurrencySymbol) value = this.withCurrencySymbol + value;
        return value;
    }

    renderCurrency() {
        if(this.withCurrencySymbol) return '';
        return _.isUndefined(this.currency) ? this.CURRENCY_DEFAULT : this.currency;
    }
});

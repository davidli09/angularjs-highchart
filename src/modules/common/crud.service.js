module.exports = (class service {
    static $name = require('_util').prefix + 'CrudService';

    static $inject = [
        'metadata',
        '$resource'
    ];

    constructor(metadata, $resource) {
        this.$i = {metadata, $resource};
        this._init();
    }

    _init() {
        //this.Search = this.$i.$resource(`${this.$i.metadata.apiUrl}/search`);
    }
});

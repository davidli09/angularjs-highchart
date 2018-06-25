require('./prototype1.component.less');

const componentAttrs = require('_util').componentAttrs(__filename);

module.exports = {
    $name: componentAttrs.$name,
    template: require('./prototype1.component.html'),
    controller: require('./prototype1.component.controller'),
    controllerAs: componentAttrs.controllerAs
};

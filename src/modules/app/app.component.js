require('./app.component.less');

const componentAttrs = require('_util').componentAttrs(__filename);

module.exports = {
    $name: componentAttrs.$name,
    template: require('./app.component.html'),
    controller: require('./app.component.controller'),
    controllerAs: componentAttrs.controllerAs
};

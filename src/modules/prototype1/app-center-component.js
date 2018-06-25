require('./app-center-component.less');

const componentAttrs = require('_util').componentAttrs(__filename);

module.exports = {
    NAME: componentAttrs.$name,
    template: require('./app-center-component.html'),
    controller: require('./app-center-component-controller'),
    controllerAs: componentAttrs.controllerAs,

    bindings: {
        _input_onCompleted: '&onCompleted'
    }
};

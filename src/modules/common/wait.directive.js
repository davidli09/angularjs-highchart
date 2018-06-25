require('./wait.directive.less');

const attrs = require('_util').directiveAttrs(__filename);

directive.$name = attrs.$name;
directive.$inject = [];
function directive() {
    return {
        template: require('./wait.directive.html')
    };
}

module.exports = directive;

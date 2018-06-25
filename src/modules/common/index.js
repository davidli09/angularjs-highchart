const dependencies = [
    require('angular-resource')
];

const crudService = require('./crud.service');
const waitDirective = require('./wait.directive');
const amountDirective = require('./amount.directive');

module.exports = angular.module(`${require('_util').prefix}.common`, dependencies)
    .service(crudService.$name, crudService)
    .directive(waitDirective.$name, waitDirective)
    .directive(amountDirective.$name, amountDirective);

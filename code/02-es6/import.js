import angular from 'angular';
import 'angular-ui-router';
import ExampleController from './example-controller';

const dependencies = [
    'ui.router'
];

export default angular
    .module('example-module', dependencies)
    .controller('ExampleController', ExampleController);
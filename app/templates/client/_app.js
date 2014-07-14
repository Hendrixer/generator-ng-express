(function (angular) {
  'use strict';
  angular.module('<%= name %>', [<%= injectables %> ,'<%= name %>.main'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/<%= name %>/main/notes');

    $stateProvider
      .state('<%= name %>', {
        url: '/<%= name %>',
        abstract: true,
        template: '<ui-view></ui-view>'
      });
  });
}(angular));




(function (angular) {
  "use strict";
  angular.module('<%= name %>.main', ['ui.router', '<%= name %>.main.note'])
  .config(function (<%= providers %>) {
    $stateProvider
      .state('<%= name %>.main', {
        url: '/main',
        templateUrl: 'main/main.tpl.html',
        controller: 'MainController'
      });
  })
  .controller('MainController', function ($state) {
    $state.transitionTo('<%= name %>.main.note');
  });
}(angular));

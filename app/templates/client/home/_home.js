(function (angular) {
  "use strict";
  angular.module('<%= name %>.main', ['ui.router', '<%= name %>.main.note'])
  .config(function (<%= providers %>) {
    $stateProvider
      .state('<%= name %>.main', {
        url: '/main',
        abstract: true,
        templateUrl: 'main/main.tpl.html'
      });
  });
}(angular));

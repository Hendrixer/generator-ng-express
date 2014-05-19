(function (angular) {
  "use strict";
  angular.module('<%= name %>.main', ['ngRoute', '<%= name %>.main.note'])
  .config(function (<%= providers %>) {
    $routeProvider
      .when('/', {
        templateUrl: 'main/main.tpl.html',
        controller: 'MainController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .controller('MainController', function ($scope) {
    $scope.things = [];
  });
}(angular));

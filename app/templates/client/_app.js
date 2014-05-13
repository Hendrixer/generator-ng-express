(function (angular) {
  "use strict";
  angular.module('<%= name %>', [<%= injectables %> ,'<%= name %>.home'])

  .controller("MainController", function ($scope) {
    $scope.message = 'ngExpress';
  });
}(angular));




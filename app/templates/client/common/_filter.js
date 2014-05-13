(function (angular) {
  "use strict";

  angular.module('<%= name %>')

  .filter('cap', function () {
    return function (input) {
      return input[0].toUppercase() + input.slice(1);
    };
  });
}(angular))
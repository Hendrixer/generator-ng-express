(function (angular) {
  "use strict";
  angular.module('<%= name %>.home', [
      <% if(route === 'ngRoute') { %>
        'ngRoute'
      <% } %>
      <% if(route === 'uiRoute') { %>
        'ui.router'
      <% } %>
    ])
  .config(function (<%= providers %>) {
    <% if(route === 'ngRoute') { %>
    $routeProvider
      .when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeController'
      });
    <% } %>
    <% if(route === 'uiRoute') { %>
    $urlRouterProvider.otherwise('home');
    $stateProvider
      .state('home', {
        url: '/home',
        template: 'home/home.html',
        controller: 'HomeController'
      });
    <% } %>
  })
  .controller('HomeController', function () {
    $scope.name = 'Home';
  });
}(angular))

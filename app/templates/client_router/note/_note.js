angular.module('<%= name %>.main.note', ['ngRoute'])

.config(function (<%= providers %>) {
  $routeProvider
    .when('/notes', {
      templateUrl: 'note/note.tpl.html',
      controller: 'NoteController'
    });
})
.controller('NoteController', function ($scope) {
  $scope.notes = [];
});
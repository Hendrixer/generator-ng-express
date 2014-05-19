angular.module('<%= name %>.main.note', ['ui.router'])

.config(function (<%= providers %>) {

  $stateProvider
    .state('<%= name %>.main.note', {
      url: '/notes',
      templateUrl: 'note/note.tpl.html',
      controller: 'NoteController'
    });
})
.controller('NoteController', function ($scope) {
  $scope.notes = [];
});
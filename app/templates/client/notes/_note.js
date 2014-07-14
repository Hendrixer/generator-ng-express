angular.module('<%= name %>.main.note', ['ui.router'])

.config(function (<%= providers %>) {

  $stateProvider
    .state('<%= name %>.main.notes', {
      url: '/notes',
      templateUrl: 'note/note.tpl.html',
      controller: 'NoteController'
    });
})
.controller('NoteController', function ($scope) {
  $scope.message = 'Yooo!';
});

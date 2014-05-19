(function (angular) {
  "use strict";
  angular.module('<%= name %>', [<% _.each(injectables,function(mod,in){ %> '<%= mod %>' <% }); %> '<%= name %>.main']);
}(angular));




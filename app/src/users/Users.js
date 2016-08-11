(function(){
  'use strict';

  // Prepare the 'users' module for subsequent registration of controllers and delegates
  angular.module('users', [ 'ngMaterial','ui.router' ])
      .config(function ($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise("/");
          $stateProvider
              .state('state1', {
                  url: "state1",
                  templateUrl: '/app/src/users/view/contactSheet.html'
              });
      });


})();

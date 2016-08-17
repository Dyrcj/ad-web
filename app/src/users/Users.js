(function(){
  'use strict';

  // Prepare the 'users' module for subsequent registration of controllers and delegates
  angular.module('users', [ 'ngMaterial','ui.router' ])
      .config(function ($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise("/");
          $stateProvider
              .state('login', {
                  url: "/login",
                  templateUrl: '/app/src/users/view/login.html',
                  controller: 'UserController'
              });
      });


})();

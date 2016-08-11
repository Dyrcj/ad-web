(function() {
    'use strict';

    angular.module('managePanel', ['ngMaterial', 'ui.router'])
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
            $stateProvider
                .state('managePanel', {
                    url: "managePanel",
                    templateUrl: '/app/src/managePanel/view/main.html'
                });
        });
})();
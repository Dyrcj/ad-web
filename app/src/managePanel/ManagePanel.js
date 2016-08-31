(function() {
    'use strict';

    angular.module('managePanel', ['ngMaterial', 'ui.router'])
        .config(function ($stateProvider, $urlRouterProvider,$httpProvider) {
            $urlRouterProvider.otherwise("/");
            $stateProvider
                .state('managePanel', {
                    url: "/managePanel",
                    templateUrl: '/app/src/managePanel/view/main.html',
                    controller: 'ManagePanelController'
                });
                // $httpProvider.defaults.useXDomain = true;
                // delete $httpProvider.defaults.headers.common['X-Requested-With'];
        });
})();

(function() {
    'use strict';

    angular.module('onlinePanel', ['ngMaterial', 'ui.router'])
        .config(function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise("/");
            $stateProvider
                .state('onlinePanel', {
                    url: "/onlinePanel",
                    templateUrl: '/app/src/onlinePanel/view/main.html',
                    controller: 'onlinePanelMainController'
                });

        });
})();
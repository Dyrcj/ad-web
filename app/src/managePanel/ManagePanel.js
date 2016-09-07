(function() {
    'use strict';

    angular.module('managePanel', ['ngMaterial', 'ui.router'])
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
            $stateProvider
                .state('managePanel', {
                    url: "/managePanel",
                    templateUrl: '/app/src/managePanel/view/main.html',
                    controller: 'ManagePanelController'
                })
                .state('manageAssociate', {
                    url: '/managePanel/manageAssociate',
                    params: {
                        b_id:null
                    },
                    templateUrl: '/app/src/managePanel/view/AssociateBusiness.html',
                    controller: 'AssociateBusinessController'
                });
        });
})();

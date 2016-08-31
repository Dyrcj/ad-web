(function () {
    'use strict';

    angular.module('sso', ['ngMaterial', 'ui.router'])
        .config(function ($stateProvider) {
            $stateProvider
                .state('sso', {
                    url: "/sso",
                    templateUrl: '/app/src/sso/view/sso.html',
                    controller: 'ssoController'
                });

        });
})();
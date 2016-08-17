(function () {
    'use strict';

    angular.module('person', ['ngMaterial', 'ui.router'])
        .config(function ($stateProvider) {
            $stateProvider
                .state('person', {
                    url: "/person",
                    templateUrl: '/app/src/persons/view/person.html',
                    controller: 'personController'
                });

        });
})();
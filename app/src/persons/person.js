(function () {
    'use strict';

    angular.module('person', ['ngMaterial', 'ui.router'])
        .config(function ($stateProvider) {
            $stateProvider
                .state('person', {
                    url: '/person',
                    templateUrl: '/app/src/persons/view/person.html',
                    controller: 'personController'
                })
                .state('forbusiness', {
                    url: '/person/forbusiness',
                    params: {
                      u_id: null
                    },
                    templateUrl: '/app/src/persons/view/addBussinessForPerson.html',
                    controller: 'addBussinessForPersonCtrl'
                });

        });
})();

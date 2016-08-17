(function () {
    'use strict';

    angular.module('person')
        .service('personService', ['$q', '$http', personService]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{loadAll: Function}}
     * @constructor
     */

    function personService($q, $http) {
        function queryAllPerson() {
            var defer = $q.defer();
            $http.get(
                'http://172.17.106.21:4200/user'
            ).then(function (result) {
                    defer.$$resolve(result['data']['message']);
                }).catch(function (err) {
                    defer.$$reject(err);
                });
            return defer.promise;
        }

        function queryBussinessByUser(userId){
            var defer = $q.defer();
            $http.get(
                'http://172.17.106.21:4200/user/business/' + userId
            ).then(function (result) {
                    defer.$$resolve(result['data']);
                }).catch(function (err) {
                    defer.$$reject(err);
                });
            return defer.promise;
        }

        // Promise-based API
        return {
            queryAllPerson: function () {
                // Simulate async nature of real remote calls
                return queryAllPerson();
            },
            queryBussinessByUser: function (userId) {
                // Simulate async nature of real remote calls
                return queryBussinessByUser(userId);
            }
        };
    }
})();

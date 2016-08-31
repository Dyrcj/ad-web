(function () {
    'use strict';

    angular.module('person')
        .service('personService', ['$q', '$http','ENV', personService]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{loadAll: Function}}
     * @constructor
     */

    function personService($q, $http, ENV) {
        var ad_config = {
          ip: ENV.main_server.ip,
          port: ENV.main_server.port
        }

        function queryAllPerson() {
            var defer = $q.defer();
            $http.get(
                'http://' + ad_config.ip + ':' + ad_config.port + '/user'
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
                'http://' + ad_config.ip + ':' + ad_config.port + '/user/business/' + userId
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

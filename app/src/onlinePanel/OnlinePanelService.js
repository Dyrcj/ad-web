(function () {
    'use strict';

    angular.module('onlinePanel')
        .service('onlinePanelService', ['$q', '$http', OnlinePanelService]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{loadAll: Function}}
     * @constructor
     */

    function OnlinePanelService($q, $http) {

        function getBusiness(userID) {
            var defer = $q.defer();
            $http.get(
                'http://172.17.106.21:4200/business/user/businesses'
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

        function openServer(serverId) {
            var defer = $q.defer();
            $http.get(
                'http://172.17.106.21:4200/server/startServer/' + serverId
            ).then(function (result) {
                if(result['data']['success']) {
                    defer.$$resolve(result['data']['message']);
                } else {

                }
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

        function closeServer(serverId) {
            var defer = $q.defer();
            $http.get(
                'http://172.17.106.21:4200/server/stopServer/' + serverId
            ).then(function (result) {
                console.log(result['data']);
                if(result['data']['success']) {
                    defer.$$resolve(result['data']['message']);
                } else {

                }
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

        function postBusiness(data) {
            var defer = $q.defer();
            $http.post(
                'http://172.17.106.21:4200/business/add',
                $.param(data)
            ).then(function (result) {
                console.log(JSON.stringify(result));
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

        function getServerInfo(serverID) {
            var defer = $q.defer();
            var url = 'http://172.17.106.21:4200/server/' + serverID;
            $http.get(url)
                .then(function (result) {
                    if(result['data']['success']) {
                        defer.$$resolve(result['data']['message']);
                    } else {

                    }
                }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

        function postInnerTest(data) {
            var defer = $q.defer();
            var url = 'http://172.17.106.21:4200/online/innerTest';
            $http.post(url,$.param(data))
                .then(function (result) {
                    if(result['data']['success']) {
                        defer.$$resolve(result['data']['message']);
                    } else {
                        console.log(result['data']['message']);
                        defer.$$reject(result['data']['message']);
                    }
                    console.log(JSON.stringify(result));

                }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

        function postTestStatus(data) {
            var defer = $q.defer();
            var url = 'http://172.17.106.21:4200/online/testStatus';
            $http.post(url,$.param(data))
                .then(function (result) {
                    console.log(result);
                    if(result['data']['success']) {
                        defer.$$resolve(result['data']['message']);
                    } else {
                        console.log(result['data']['message']);
                        defer.$$reject(result['data']['message']);
                    }
                    console.log(JSON.stringify(result));

                }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

        // Promise-based API
        return {
            innerTest: function (data) {
                return postInnerTest(data);
            },
            closeRemoteServer: function (serverId) {
                return closeServer(serverId);
            },
            openRemoteServer: function (serverId) {
                return openServer(serverId);
            },
            loadAllBusinesses: function () {
                // Simulate async nature of real remote calls
                return getBusiness();
            },
            getRemoteServerInfo: function (serverID) {
                return getServerInfo(serverID);
            },
            createBusiness: function (data) {
                return postBusiness(data);
            },
            testStatus: function (data) {
                return postTestStatus(data);
            }
        };
    }

})();

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
    var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTdhODIwMjk3MTIyYjZmMzA1YTA1ZWE1IiwibmFtZSI6InVzZXIyIiwiZW1haWwiOiJ1c2VyMjJAeWVlcGF5LmNvbSIsImlzX2FkbWluIjp0cnVlLCJwaG9uZSI6MTgzNjYxMTEwMDIsImlhdCI6MTQ3MTMyODIyNiwiZXhwIjoxNDcxNDE0NjI2fQ.ot54Ou6QVxF7C0qrDzvd6E9NBJHwoVeZO5kSa0qIO-w";

    function OnlinePanelService($q, $http) {

        function getBusiness(userID) {
            var defer = $q.defer();
            $http.get(
                'http://172.17.106.21:4200/business/user/businesses',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'token': token
                    }
                }
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

        function postBusiness(data) {
            var defer = $q.defer();
            $http.post(
                'http://172.17.106.21:4200/business/add',
                $.param(data),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'token': token
                    }
                }
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

        var serverInfos = [{
            serverID: '1',
            serverName: 'server1',
            status: 'running',
            version: '75',
            gitVersionList: [71, 72, 73, 74, 75],
            log: '巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴'
        },
            {
                serverID: '2',
                serverName: 'server2',
                status: 'stop',
                version: '75',
                gitVersionList: [71, 72, 73, 74, 75],
                log: '巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴'
            },
            {
                serverID: '3',
                serverName: 'server3',
                status: 'running',
                version: '75',
                gitVersionList: [71, 72, 73, 74, 75],
                log: '巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴\n巴拉巴拉巴拉巴'
            }];
        var serverIPList = [
            '192.168.123.13',
            '192.168.123.14',
            '192.168.123.15',
            '192.168.123.16',
            '192.168.123.17',
            '192.168.123.18'

        ];

        // Promise-based API
        return {
            loadAllBusinesses: function () {
                // Simulate async nature of real remote calls
                return getBusiness();
            },
            getRemoteServerInfo: function (serverID) {
                var serverInfo;
                for (var i = 0; i < serverInfos.length; i++) {
                    if (serverID == serverInfos[i].serverID) {
                        serverInfo = serverInfos[i];
                    }
                }
                return $q.when(serverInfo);
            },
            createBusiness: function (data) {
                return postBusiness(data);
            }
        };
    }

})();

(function () {
    'use strict';

    angular.module('onlinePanel')
        .service('onlinePanelService', ['$q', OnlinePanelService]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{loadAll: Function}}
     * @constructor
     */
    function OnlinePanelService($q) {
        var Businesses = [
            {
                name: '业务1',
                servers: [{serverNameID: 1, serverName: 'server1', status: 'running', version: '75'},
                    {serverNameID: 1, serverName: 'server1', status: 'running', version: '75'},
                    {serverNameID: 1, serverName: 'server1', status: 'running', version: '75'},
                    {serverNameID: 1, serverName: 'server1', status: 'running', version: '75'}]
            },
            {
                name: '业务2',
                servers: [{serverNameID: 2, serverName: 'server2', status: 'stop', version: '75'},
                    {serverNameID: 1, serverName: 'server1', status: 'running', version: '75'}]
            },
            {
                name: '业务3',
                servers: [{serverNameID: 3, serverName: 'server3', status: 'stop', version: '75'},
                    {serverNameID: 1, serverName: 'server1', status: 'running', version: '75'},
                    {serverNameID: 1, serverName: 'server1', status: 'running', version: '75'}]
            },
            {
                name: '业务4',
                servers: [{serverNameID: 5, serverName: 'server5', status: 'running', version: '75'},
                    {serverNameID: 5, serverName: 'server5', status: 'running', version: '75'},
                    {serverNameID: 5, serverName: 'server5', status: 'running', version: '75'},
                    {serverNameID: 5, serverName: 'server5', status: 'running', version: '75'},
                    {serverNameID: 5, serverName: 'server5', status: 'running', version: '75'}]
            },
            {
                name: '业务5',
                servers: [{serverNameID: 5, serverName: 'server5', status: 'running', version: '75'},
                    {serverNameID: 5, serverName: 'server5', status: 'running', version: '75'},
                    {serverNameID: 5, serverName: 'server5', status: 'running', version: '75'},
                    {serverNameID: 5, serverName: 'server5', status: 'running', version: '75'},
                    {serverNameID: 5, serverName: 'server5', status: 'running', version: '75'}]
            },
            {
                name: '业务6',
                servers: [{serverNameID: 6, serverName: 'server6', status: 'stop', version: '75'}]
            },
            {
                name: '业务7',
                servers: [{serverNameID: 7, serverName: 'server7', status: 'stop', version: '75'}]
            },
            {
                name: '业务8',
                servers: [{serverNameID: 5, serverName: 'server5', status: 'running', version: '75'},
                    {serverNameID: 5, serverName: 'server5', status: 'running', version: '75'},
                    {serverNameID: 5, serverName: 'server5', status: 'running', version: '75'},
                    {serverNameID: 5, serverName: 'server5', status: 'running', version: '75'},
                    {serverNameID: 5, serverName: 'server5', status: 'running', version: '75'}]
            },
            {
                name: '业务9',
                servers: [{serverNameID: 6, serverName: 'server6', status: 'stop', version: '75'}]
            },
            {
                name: '业务10',
                servers: [{serverNameID: 7, serverName: 'server7', status: 'stop', version: '75'}]
            },
            {
                name: '业务11',
                servers: [{serverNameID: 6, serverName: 'server6', status: 'stop', version: '75'}]
            },
            {
                name: '业务12',
                servers: [{serverNameID: 7, serverName: 'server7', status: 'stop', version: '75'}]
            }
        ];

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
                return $q.when(Businesses);
            },
            getRemoteServerInfo: function (serverID) {
                var serverInfo;
                for(var i = 0; i < serverInfos.length; i ++) {
                    if(serverID == serverInfos[i].serverID) {
                        serverInfo = serverInfos[i];
                    }
                }
                return $q.when(serverInfo);
            }
        };
    }

})();
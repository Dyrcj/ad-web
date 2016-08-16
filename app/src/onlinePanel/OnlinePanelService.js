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
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7ImNyZWF0ZV9hdCI6ImluaXQiLCJpc19hZG1pbiI6ImluaXQiLCJwb3NpdGlvbiI6ImluaXQiLCJkZXNjcmlwdGlvbiI6ImluaXQiLCJkZXBhcnRtZW50IjoiaW5pdCIsImNvbXBhbnlfcGhvbmUiOiJpbml0IiwiX192IjoiaW5pdCIsIm5hbWUiOiJpbml0IiwicGFzc3dvcmQiOiJpbml0IiwiZW1haWwiOiJpbml0IiwicGhvbmUiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsicG9zaXRpb24iOnRydWUsImRlc2NyaXB0aW9uIjp0cnVlLCJkZXBhcnRtZW50Ijp0cnVlLCJjb21wYW55X3Bob25lIjp0cnVlLCJfX3YiOnRydWUsImNyZWF0ZV9hdCI6dHJ1ZSwiaXNfYWRtaW4iOnRydWUsIm5hbWUiOnRydWUsInBhc3N3b3JkIjp0cnVlLCJlbWFpbCI6dHJ1ZSwicGhvbmUiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJjcmVhdGVfYXQiOiIyMDE2LTA4LTA4VDA2OjAxOjEzLjI2OFoiLCJpc19hZG1pbiI6dHJ1ZSwicG9zaXRpb24iOiLlvIDlj5Hlt6XnqIvluIgiLCJkZXNjcmlwdGlvbiI6ImxhbGFsYSIsImRlcGFydG1lbnQiOiLov5Dnu7TmioDmnK_pg6giLCJjb21wYW55X3Bob25lIjoxNTMzMDAzMDAwMiwiX192IjowLCJuYW1lIjoidXNlcjIiLCJwYXNzd29yZCI6IjhjN2UzZTBlMzM2MzJmZjJlMzc0MDQxYmIzNTVlMGVmN2UwZDVhNmE3NmMzZWUxNjg2ZDMxYWMwNzM0MzcwNDAiLCJlbWFpbCI6InVzZXIyMkB5ZWVwYXkuY29tIiwicGhvbmUiOjE4MzY2MTExMDAyLCJfaWQiOiI1N2E4MjAyOTcxMjJiNmYzMDVhMDVlYTUifSwiX3ByZXMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W251bGwsbnVsbF0sIiRfX29yaWdpbmFsX3ZhbGlkYXRlIjpbbnVsbF0sIiRfX29yaWdpbmFsX3JlbW92ZSI6W251bGxdfSwiX3Bvc3RzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltdLCIkX19vcmlnaW5hbF92YWxpZGF0ZSI6W10sIiRfX29yaWdpbmFsX3JlbW92ZSI6W119LCJpYXQiOjE0NzEzMTUxOTQsImV4cCI6MTQ3MTQwMTU5NH0.KypUjkLB2bnpABVKIzbX_MZIEWvD2R67Y_nU869Q7fI";
    function OnlinePanelService($q, $http) {

      function getBusiness(userID) {
        var defer = $q.defer();
        $http.get(
          'http://172.17.106.21:4200/business/user/businesses',
          {
            headers:{
              'Content-Type':'application/x-www-form-urlencoded',
              'token':token
            }
          }
        ).then(function(result){
          defer.$$resolve(result['data']['message']);
        }).catch(function(err){
          defer.$$reject(err);
        });
        return defer.promise;
      }

      function postBusiness(data){
          var defer = $q.defer();
         $http.post(
          'http://172.17.106.21:4200/business/add',
          $.param(data),
          {
            headers:{
              'Content-Type':'application/x-www-form-urlencoded',
              'token':token
            }
          }
        ).then(function (result) {
             defer.$$resolve(result['data']['message']);
         }).catch(function (err) {
             defer.$$reject(err);
         });
          return defer.promise;
      }

/*
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
*/
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
                for(var i = 0; i < serverInfos.length; i ++) {
                    if(serverID == serverInfos[i].serverID) {
                        serverInfo = serverInfos[i];
                    }
                }
                return $q.when(serverInfo);
            },
            createBusiness: function(data){
                return postBusiness(data);
            }
        };
    }

})();

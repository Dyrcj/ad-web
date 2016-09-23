define([],
    function(){
        function OnlinePanelService($q, $http, ENV, AppService) {
            var ad_config = {
                ip: ENV.main_server.ip,
                port: ENV.main_server.port
            }

            this.sync = function(data){
                var url = 'http://'+ ad_config.ip  + ':' + ad_config.port + '/online/innerTest';
                var defer = $q.defer();
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

            this.closeRemoteServer = function(serverId){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/server/stopServer/' + serverId;
                var defer = $q.defer();
                $http.get(
                    url
                ).then(function (result) {
                    console.log(result['data']);
                    if(result['data']['success']) {
                        defer.$$resolve(result['data']['message']);
                    } else {
                        defer.$$reject(result['data']['message']);
                    }
                }).catch(function (err) {
                    defer.$$reject(err);
                });
                return defer.promise;
            }

            this.openRemoteServer = function(serverId){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/server/startServer/' + serverId;
                var defer = $q.defer();
                $http.get(
                    url
                ).then(function (result) {
                    if(result['data']['success']) {
                        defer.$$resolve(result['data']['message']);
                    } else {
                        defer.$$reject(result['data']['message']);
                    }
                }).catch(function (err) {
                    defer.$$reject(err);
                });
                return defer.promise;
            }

            this.loadAllBusinesses = function(){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/user/businesses';
                return AppService.get(url);
            }

            this.getRemoteServerInfo = function(serverID){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/server/' + serverID;
                var defer = $q.defer();
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

            this.testStatus = function(data){
                var defer = $q.defer();
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/testStatus';
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

            this.online = function(data){
                var defer = $q.defer();
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/syncServers';
                console.log(JSON.stringify(data));
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

            this.onlineSuccess = function(data){
                var defer = $q.defer();
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/syncFinish';
                console.log(JSON.stringify(data));
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

            this.serversEnable = function(data){
                var defer = $q.defer();
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/serversEnable';
                console.log(JSON.stringify(data));
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

            this.rollBackFinish = function(data){
                var defer = $q.defer();
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/rollbackFinish';
                console.log(JSON.stringify(data));
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

            this.rollBack = function(data){
                var defer = $q.defer();
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/rollback';
                console.log(JSON.stringify(data));
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

            this.opAudit = function (data) {
                var defer = $q.defer();
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/opAudit';
                console.log(JSON.stringify(data));
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

        }
        return {
            OnlinePanelService: OnlinePanelService
        }
    }
)

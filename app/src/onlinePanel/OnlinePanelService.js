define([],
    function(){
        function OnlinePanelService($q, $http, ENV, AppService) {
            var ad_config = {
                ip: ENV.main_server.ip,
                port: ENV.main_server.port
            }

            this.sync = function(data){
                var url = 'http://'+ ad_config.ip  + ':' + ad_config.port + '/online/syncToRepository';
                return AppService.post(url, data);
            }

            this.closeRemoteServer = function(serverId){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/server/stopServer/' + serverId;
                return AppService.get(url);
            }

            this.openRemoteServer = function(serverId){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/server/startServer/' + serverId;
                return AppService.get(url);
            }

            this.loadAllBusinesses = function(){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/user/businesses';
                return AppService.get(url);
            }

            this.getRemoteServerInfo = function(serverID){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/server/' + serverID;
                return AppService.get(url);
            }

            this.testStatus = function(data){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/testStatus';
                return AppService.post(url, data);
            }

            this.online = function(data){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/syncServers';
                return AppService.post(url, data);
            }

            this.innerTest = function(data){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/innerTest';
                return AppService.post(url, data);
            }

            this.onlineSuccess = function(data){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/syncFinish';
                return AppService.post(url, data);
            }

            this.serversEnable = function(data){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/serversEnable';
                return AppService.post(url, data);
            }

            this.serversDisable = function(data){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/serversDisable';
                return AppService.post(url, data);
            }

            this.rollBackFinish = function(data){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/rollbackFinish';
                return AppService.post(url, data);
            }

            this.rollBack = function(data){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/rollback';
                return AppService.post(url, data);
            }

            this.opAudit = function (data) {
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/online/opAudit';
                return AppService.post(url, data);
            }

        }
        return {
            OnlinePanelService: OnlinePanelService
        }
    }
)

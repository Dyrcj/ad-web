define([],
    function(){
        function LogService(ENV, $q, $http, AppService){

            var ad_config = {
              ip: ENV.main_server.ip,
              port: ENV.main_server.port
            }

    //获取所有业务
            this.getAllBusinessUsers = function(){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/operation/usersandbusinesses';
                return AppService.get(url);
            }

    //获取日志id
            this.getAllLogs = function(data){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/operation/IDList';
                return AppService.post(url, data);
            }

        }
        return {
            LogService: LogService
        }
    }
);

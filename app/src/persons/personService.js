define([],
    function(){
        function personService($q, $http, ENV, AppService) {
            var ad_config = {
              ip: ENV.main_server.ip,
              port: ENV.main_server.port
            }

            this.queryAllPerson = function(){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/user';
                return AppService.get(url);
            }

            this.queryBussinessByUser = function(userId){
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

        }
        return {
            personService: personService
        }
    }
);

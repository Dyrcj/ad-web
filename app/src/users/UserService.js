(function(){
    'use strict';

    angular.module('users')
        .service('userService', ['$q', '$http', 'ENV', UserService]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{loadAll: Function}}
     * @constructor
     */
    function UserService($q, $http, ENV){
        var ad_config = {
            ip: ENV.main_server.ip,
            port: ENV.main_server.port
        }

        function postLogin(data) {
            var defer = $q.defer();
            $http.post(
                'http://' + ad_config.ip + ':' + ad_config.port + '/user/signin',
                $.param(data)
            ).then(function (result) {
                console.log(result['data']['success']);
                if(result['data']['success']) {
                    defer.$$resolve(result['data']['token']);
                } else {
                    defer.$$reject(result['data']['message']);
                }
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

        // Promise-based API
        return {
            userLogin: function (data) {
                return postLogin(data);
            }
        };
    }

})();

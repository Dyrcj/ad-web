define(['socket.io'], function(io){
    function AppService($q,$http){

        this.get = function(url){
            var defer = $q.defer();
            $http.get(
                url
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch (function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

        this.post = function(url, data){
            var defer = $q.defer();
            $http.post(
                url,
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

        this.delete = function(url){
            var defer = $q.defer();
            $http.delete(
                url
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

    }

    function mainService($http, $q, ENV){
        this.postToken = function(token){
            var defer = $q.defer();
            var data = {
                token: token
            };
            var http = 'http://' + ENV.main_server.ip + ':' + ENV.main_server.port + '/sso/interceptor/';
            $http.post(
                http,
                $.param(data)
            ).then(function (result) {
                console.log(result);
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
    }

    function socket(ENV){
        var socket = io.connect(ENV.main_server.ip + ":" + ENV.main_server.port);
        socket.on('connect', function () {
            console.log('connect sucess');
        });
        socket.on('error', function (err) {
            console.log(err);
        });
        return socket;
    }

    function subpub(socket){
        var container =  [];
        return {
            subscribe: function (options, callback) {
                if(options){
                    var collectionName = options.collectionName;
                    var userId = options.userId;
                    var modelId = options.modelId;
                    var name = '/' + collectionName + '/' + modelId + '/' + userId;
                    socket.on(name, callback);
                    socket.emit('sub', name);
                    this.pushContainer(name);
                }else{
                    throw 'Error: Option must be an object';
                }
            },
            pushContainer : function(subscriptionName){
                container.push(subscriptionName);
            }
        };
    }

    function authHttpResponseInterceptor($q, $location, $sessionStorage, $injector){
        return {
            response: function(response){
                if (response.status === 401 || response.status === 403) {
                    var stateService = $injector.get('$state');
                    stateService.go('login');
                }

                return response || $q.when(response);
            },
            responseError: function(rejection) {
                if (rejection.status === 401 || rejection.status === 403) {
                    var stateService = $injector.get('$state');
                    stateService.go('login');
                }
                return $q.reject(rejection);
            },
            request: function (config) {
                config.headers = config.headers || {};
                config.headers["Content-Type"] = "application/x-www-form-urlencoded";
                if ($sessionStorage.token) {
                    config.headers.token = $sessionStorage.token;
                }
                console.log(config);
                return config;
            }
        };
    }
    return {
        AppService: AppService,
        mainService: mainService,
        socket: socket,
        subpub: subpub,
        authHttpResponseInterceptor: authHttpResponseInterceptor
    }
});

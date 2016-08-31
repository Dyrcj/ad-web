angular
    .module('starterApp', ['ngMaterial', 'ui.router', 'ngMdIcons', 'ngStorage', 'users', 'resourcePanel', 'managePanel', 'onlinePanel', 'angular-jwt', 'person', 'sso', 'config'])
    .config(function ($mdThemingProvider, $mdIconProvider, $httpProvider) {
        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("menu", "./assets/svg/menu.svg", 24);
        $mdThemingProvider.theme('default')
            .primaryPalette('light-blue')
            .accentPalette('orange')
            .warnPalette('red');
        $httpProvider.interceptors.push('authHttpResponseInterceptor');

    })
    .controller('baseController', ['$scope', '$state', '$sessionStorage', '$location', 'mainService', 'jwtHelper', 'socket', function ($scope, $state, $sessionStorage, $location, mainService, jwtHelper) {
        $scope.logout = function () {
            console.log('logout');
            delete $sessionStorage.token;
            delete $sessionStorage.userInfo;
            $state.go('login');
        };
        /*$http.post(
            http,
            $.param(params)
        ).then(function (res) {
            console.log(JSON.stringify(res));
        });*/
        var tokenLocation = $location.$$absUrl;
        console.log(tokenLocation);
        if(tokenLocation.indexOf('yeepay_sso_token') >= 0) {
            var lastPos = tokenLocation.indexOf('#');
            var token;
            if(lastPos >= 0) {
                token = tokenLocation.substring(tokenLocation.indexOf('=') + 1, tokenLocation.indexOf('#'));
            } else {
                token = tokenLocation.substring(tokenLocation.indexOf('=') + 1, tokenLocation.length);
            }
            console.log('token:' + token);
            mainService.postToken(token)
                .then(function (result) {
                    alert(result);
                    $sessionStorage.token = result;
                    $sessionStorage.userInfo = jwtHelper.decodeToken(result);
                    console.log($sessionStorage.userInfo);
                    $state.go('onlinePanel');
                })
                .catch(function (err) {
                    alert(err);
                });


        }
    }])
    .factory('socket', function () {
        var socket = io.connect('172.17.106.21:4200');
        socket.on('connect', function () {
            console.log('connect sucess');
        });
        socket.on('error', function (err) {
            console.log(err);
        });
        return socket;
    })
    .factory('subpub', function (socket) {
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
                    //Push the container..
                    this.pushContainer(name);
                }else{
                    throw 'Error: Option must be an object';
                }
            },
            pushContainer : function(subscriptionName){
                container.push(subscriptionName);
            }/*,
            unSubscribeAll: function(){
                for(var i=0; i<container.length; i++){
                    socket.removeAllListeners(container[i]);
                }
                //Now reset the container..
                container = [];
            }*/
        };
    })
    .factory('authHttpResponseInterceptor', ['$q','$location', '$sessionStorage', '$injector', function($q, $location, $sessionStorage, $injector) {
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
                console.log($sessionStorage.token);
                console.log(config.headers.token);
                return config;
            }
        };
    }])
    .service('mainService', ['$http', '$q', function ($http, $q) {

        function postTokenService(token) {
            var defer = $q.defer();
            var data = {
                token: token
            };
            var http = 'http://172.17.106.21:4200/sso/interceptor/';
            $http.post(
                http,
                $.param(data)
            ).then(function (result) {
                //var result = JSON.stringify(result);
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
        return {
            postToken : function(token) {
                return postTokenService(token);
            }
        }
    }]);

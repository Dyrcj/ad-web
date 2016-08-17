angular
    .module('starterApp', ['ngMaterial', 'ui.router', 'ngMdIcons', 'ngStorage', 'users', 'managePanel', 'onlinePanel', 'angular-jwt', 'person'])
    .config(function ($mdThemingProvider, $mdIconProvider, $httpProvider) {
        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("menu", "./assets/svg/menu.svg", 24);
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('red');
        $httpProvider.interceptors.push('authHttpResponseInterceptor');

    })
    .controller('baseController', ['$scope', '$state', '$sessionStorage', 'socket', function ($scope, $state, $sessionStorage) {
        $scope.logout = function () {
            console.log('logout');
            delete $sessionStorage.token;
            delete $sessionStorage.userInfo;
            $state.go('login');
        }
    }])
    .factory('socket', function () {
        var socket = io.connect('172.17.106.21:4200');
        socket.on('connect', function () {
            console.log('connect sucess');
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
                //var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTdhODIwMjk3MTIyYjZmMzA1YTA1ZWE1IiwibmFtZSI6InVzZXIyIiwiZW1haWwiOiJ1c2VyMjJAeWVlcGF5LmNvbSIsImlzX2FkbWluIjp0cnVlLCJwaG9uZSI6MTgzNjYxMTEwMDIsImlhdCI6MTQ3MTMyODIyNiwiZXhwIjoxNDcxNDE0NjI2fQ.ot54Ou6QVxF7C0qrDzvd6E9NBJHwoVeZO5kSa0qIO-w";
                //$sessionStorage.token = token;
                config.headers = config.headers || {};
                config.headers["Content-Type"] = "application/x-www-form-urlencoded";
                console.log('test');
                if ($sessionStorage.token) {
                    config.headers.token = $sessionStorage.token;
                }
                console.log(config.headers.token);
                return config;
            }
        };
    }]);

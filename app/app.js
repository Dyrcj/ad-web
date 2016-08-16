angular
    .module('starterApp', ['ngMaterial', 'ui.router', 'ngMdIcons', 'ngStorage', 'managePanel', 'onlinePanel'])
    .config(function ($mdThemingProvider, $mdIconProvider) {
        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("menu", "./assets/svg/menu.svg", 24);
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('red');

    })
    .controller('baseController', ['$scope', '$sessionStorage', 'socket', function ($scope, $sessionStorage) {
        var data = {
            userID: '12',
            userName: 'lidawei',
            orgID: '2',
            token: 'sfssfd-afds-asdf-af32s'
        };
        $sessionStorage.data = data;

        console.log($sessionStorage.data);

        delete $sessionStorage.data;
        console.log($sessionStorage.data);
        /*subpub.subscribe({}, function (result) {
            console.log(result);
        });*/

    }])
    .factory('socket', function () {
        var socket = io.connect('127.0.0.1:4200');
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
            },
            unSubscribeAll: function(){
                for(var i=0; i<container.length; i++){
                    socket.removeAllListeners(container[i]);
                }
                //Now reset the container..
                container = [];
            }
        };
    });

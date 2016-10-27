define(['./LogPanelController', './LogPanelService'],
    function(ctrl, service){
        function init(app){
            app.config(function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise("/");
                $stateProvider
                    .state('logPanel', {
                        url: "/logPanel",
                        templateUrl: '/app/src/logPanel/view/main.html',
                        css: ['./assets/common.css', './src/logPanel/css/main.css'],
                        controller: 'LogController'
                    });
            })
            .controller('LogController', ['$scope',  '$q', '$timeout','logService','$state', ctrl.LogController])
            .service('logService', ['ENV', '$q', '$http', 'AppService', service.LogService]);
        }
        return {
            init: init
        }
    }
);

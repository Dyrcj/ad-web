define(['./LogPanelController', './LogPanelService'],
    function(ctrl, service){
        function init(app){
            app.config(function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise("/");
                $stateProvider
                    .state('logPanel', {
                        url: "/logPanel",
                        templateUrl: '/app/src/logPanel/view/main.html',
                        controller: 'LogController'
                    })
                    .state('logDetails', {
                        url: '/logPanel/details',
                        // params: {
                        //     b_id:null
                        // },
                        templateUrl: '/app/src/logPanel/view/logDetails.html',
                        controller: 'LogDetailsController'
                    })
            })
            .controller('LogController', ['$scope',  '$q', '$timeout','logService','$state', ctrl.LogController])
            .controller('LogDetailsController', ['$scope', 'logService', '$state', '$stateParams', ctrl.LogDetailsController])
            .service('logService', [service.LogService]);
        }
        return {
            init: init
        }
    }
);

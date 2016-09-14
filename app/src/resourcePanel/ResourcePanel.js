define(['./ResourcePanelController', './ResourcePanelService'],
    function(ctrl, service){
        function init(app){
            app.config(function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise("/");
                $stateProvider
                    .state('resourcePanel', {
                        url: '/resourcePanel',
                        templateUrl: '/app/src/resourcePanel/view/main.html',
                        controller: 'ResourcePanelController'
                    })
                    .state('lbcenter', {
                        url: '/resourcePanel/lbcenter',
                        params: {
                          _id:null
                        },
                        templateUrl: '/app/src/resourcePanel/view/LBcenter.html',
                        controller: 'LBcenterController'
                    });
            })
            .controller('ResourcePanelController',['$scope','$mdDialog','ResourcePanelService','$state',ctrl.ResourcePanelController])
            .controller('LBcenterController', ['$scope', 'ResourcePanelService', '$state','$stateParams', '$sessionStorage', ctrl.LBcenterController])
            .service('ResourcePanelService',['$q','$http','ENV','AppService', service.ResourcePanelService]);
        }
        return {
            init: init
        }
    }
);

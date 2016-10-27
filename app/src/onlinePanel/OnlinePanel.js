define(['./OnlinePanelController', './OnlinePanelService'],
    function(ctrl, service){
        function init(app){
            app.config(function ($stateProvider, $urlRouterProvider) {

                $urlRouterProvider.otherwise("/");
                $stateProvider
                    .state('onlinePanel', {
                        url: "/onlinePanel",
                        templateUrl: '/app/src/onlinePanel/view/main.html',
                        css: ['./assets/common.css', './src/onlinePanel/css/main.css'],
                        controller: 'onlinePanelMainController'
                    });

            })
            .controller('onlinePanelMainController', ['$scope', 'onlinePanelService', '$mdToast', '$sessionStorage', '$mdBottomSheet', '$mdDialog', 'subpub', ctrl.onlinePanelMainController])
            .service('onlinePanelService', ['$q', '$http','ENV','AppService', service.OnlinePanelService]);

        }
        return {
            init: init
        }
    }
);

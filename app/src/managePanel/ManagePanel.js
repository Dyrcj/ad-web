define([ './ManagePanelController', './ManagePanelService'],
    function(ctrl, service){
        function init(app){
          app.config(function ($stateProvider, $urlRouterProvider) {

              $urlRouterProvider.otherwise("/");
              $stateProvider
                  .state('managePanel', {
                      url: "/managePanel",
                      templateUrl: '/app/src/managePanel/view/main.html',
                      css: ['./assets/common.css', './src/managePanel/css/main.css'],
                      controller: 'ManagePanelController'
                  })
                  .state('manageAssociate', {
                      url: '/managePanel/manageAssociate',
                      params: {
                          b_id:null
                      },
                      templateUrl: '/app/src/managePanel/view/AssociateBusiness.html',
                      css: ['./assets/common.css', './src/managePanel/css/associateBusiness.css'],
                      controller: 'AssociateBusinessController'
                  });
          })
          .controller('ManagePanelController', ['$scope', '$mdDialog', 'ManagePanelService', '$state', ctrl.ManagePanelController])
          .controller('AssociateBusinessController',['$scope', 'ManagePanelService', '$state','$stateParams','$sessionStorage', '$q', '$timeout', ctrl.AssociateBusinessController])
          .service('ManagePanelService', ['$q', '$http', 'ENV', 'AppService', service.ManagePanelService]);
        }
        return {
          init: init
        }
    }
);

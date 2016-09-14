define([ './ManagePanelController', './ManagePanelService'],
    function(ctrl, service){
        function init(app){
          app.config(function ($stateProvider, $urlRouterProvider) {

              $urlRouterProvider.otherwise("/");
              $stateProvider
                  .state('managePanel', {
                      url: "/managePanel",
                      templateUrl: '/app/src/managePanel/view/main.html',
                      controller: 'ManagePanelController'
                  })
                  .state('manageAssociate', {
                      url: '/managePanel/manageAssociate',
                      params: {
                          b_id:null
                      },
                      templateUrl: '/app/src/managePanel/view/AssociateBusiness.html',
                      controller: 'AssociateBusinessController'
                  });
          })
          .controller('ManagePanelController', ['$scope', '$mdDialog', 'ManagePanelService', '$state', ctrl.ManagePanelController])
          .controller('AssociateBusinessController',['$scope', 'ManagePanelService', '$state','$stateParams','$sessionStorage', ctrl.AssociateBusinessController])
          .service('ManagePanelService', ['$q', '$http', 'ENV', 'AppService', service.ManagePanelService]);
        }
        return {
          init: init
        }
    }
);

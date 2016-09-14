define(['./personController', './personService'],
    function(ctrl, service){
        function init(app){
            app.config(function ($stateProvider) {
                  $stateProvider
                      .state('person', {
                          url: '/person',
                          templateUrl: '/app/src/persons/view/person.html',
                          controller: 'personController'
                      })
                      .state('forbusiness', {
                          url: '/person/forbusiness',
                          params: {
                            u_id: null
                          },
                          templateUrl: '/app/src/persons/view/addBussinessForPerson.html',
                          controller: 'addBussinessForPersonCtrl'
                      });

            })
            .controller('personController',['$scope','personService', '$mdDialog', '$state', ctrl.personController])
            .controller('addBussinessForPersonCtrl', ['$scope','personService', '$state', '$stateParams', '$sessionStorage', ctrl.addBussinessForPersonCtrl])
            .service('personService', ['$q', '$http','ENV','AppService', service.personService]);
        }
        return {
            init: init
        }
    }
);

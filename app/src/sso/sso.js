define(['./ssoController'],
    function(ctrl){
        function init(app){
            app.config(function ($stateProvider) {
                $stateProvider
                    .state('sso', {
                        url: "/sso",
                        templateUrl: '/app/src/sso/view/sso.html',
                        controller: 'ssoController'
                    });

            })
            .controller('ssoController', ['$scope', '$location', '$http', ctrl.ssoController]);
       }
      return {
          init: init
      }
});

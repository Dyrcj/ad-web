define(['./UserController', './UserService'],
    function(ctrl, service){
        function init(app){
            app.config(function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise("/");
                $stateProvider
                    .state('login', {
                        url: "/login",
                        templateUrl: '/app/src/users/view/login.html',
                        controller: 'UserController'
                    });
            })
            .controller('UserController', ctrl.UserController)
            .service('userService', ['$q', '$http', 'ENV', 'AppService', service.UserService]);
        }
        return {
            init: init
        }
    }
);

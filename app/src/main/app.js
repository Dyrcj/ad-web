define(['./appController', './appService'],
    function(ctrl, service){
        function init(app){
            app.config(function ($mdThemingProvider, $mdIconProvider, $httpProvider) {
                $mdIconProvider
                    .defaultIconSet("./assets/svg/avatars.svg", 128)
                    .icon("menu", "./assets/svg/menu.svg", 24);
                $mdThemingProvider.theme('default')
                    .primaryPalette('blue')
                    .accentPalette('light-blue')
                    .warnPalette('red');
                $httpProvider.interceptors.push('authHttpResponseInterceptor');

            })
            .controller('baseController', ['$scope', '$state', '$sessionStorage', '$location', 'mainService', 'jwtHelper', 'socket', ctrl.baseController])
            .service('AppService', ['$q', '$http', service.AppService])
            .service('mainService', ['$http', '$q', 'ENV', service.mainService])
            .factory('socket', ['ENV',  service.socket])
            .factory('subpub', ['socket', service.subpub])
            .factory('authHttpResponseInterceptor', ['$q','$location', '$sessionStorage', '$injector', service.authHttpResponseInterceptor]);
        }
        return {
            init: init
        }
    }
);

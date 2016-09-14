define([
        'angular',
        'angular-animate',
        'angular-aria',
        'angular-ui-router',
        'angular-material-icons',
        'angular-messages',
        'angular-jwt',
        'angular-material',
        'ngStorage',
        'jquery',
        'socket.io',
        'socket',
        'config',
        './src/sso/sso',
        './src/users/Users',
        './src/onlinePanel/OnlinePanel',
        './src/managePanel/ManagePanel',
        './src/persons/person',
        './src/resourcePanel/ResourcePanel',
        './src/logPanel/LogPanel',
        './src/main/app'
       ],
     function(angular, ngAnimate, ngAria, uiRouter, ngIcons, ngMessages, ngJwt, ngMaterial, ngStorage, $, io, socket, config, sso, user, online, manage, person, resource, log, app){
        function init(){
            angular.module('config', []).constant(config.key, config.value);
            var sso_module = angular.module('sso', ['ngMaterial', 'ui.router']);
            var user_module = angular.module('users', [ 'ngMaterial','ui.router']);
            var online_module = angular.module('onlinePanel', ['ngMaterial', 'ui.router']);
            var manage_module = angular.module('managePanel', ['ngMaterial', 'ui.router']);
            var person_module = angular.module('person', ['ngMaterial', 'ui.router']);
            var resource_module = angular.module('resourcePanel', ['ngMaterial', 'ui.router']);
            var log_module = angular.module('logPanel', ['ngMaterial', 'ui.router', 'ngMessages']);
            var app_module = angular.module('starterApp', ['ngMaterial', 'ui.router', 'ngMdIcons', 'ngStorage', 'angular-jwt', 'sso', 'users', 'onlinePanel', 'managePanel', 'person', 'resourcePanel', 'logPanel', 'config']);

            sso.init(sso_module);
            user.init(user_module);
            online.init(online_module);
            manage.init(manage_module);
            person.init(person_module);
            resource.init(resource_module);
            log.init(log_module);
            app.init(app_module);

            angular.bootstrap(window.document, ['starterApp']);
        }
        return {
            init: init
        }
     }
);

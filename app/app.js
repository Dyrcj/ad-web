angular
    .module('starterApp', ['ngMaterial', 'ui.router', 'ngMdIcons', 'users', 'managePanel', 'onlinePanel'])
    .config(function($mdThemingProvider, $mdIconProvider){
        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("menu", "./assets/svg/menu.svg", 24);
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('red');

    })
    .controller('baseController', ['$mdSidenav', function ($mdSidenav) {
        var self = this;
        self.toggleList   = toggleUsersList;
        function toggleUsersList() {
            $mdSidenav('left').toggle();
        }

        self.selectUser = function selectUser() {

        }

    }]);
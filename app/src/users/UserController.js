(function () {

    angular
        .module('users')
        .controller('UserController', UserController);

    /**
     * Main Controller for the Angular Material Starter App
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function UserController(userService, $scope, $state, $sessionStorage, jwtHelper) {
        $scope.login = function () {
            var data_msg = {
                username: $scope.username,
                password: $scope.password
            }
            userService.userLogin(data_msg)
                .then(function (result) {
                    alert(result);
                    $sessionStorage.token = result;
                    var tokenJSON = jwtHelper.decodeToken(result);
                    $sessionStorage.userInfo = tokenJSON;
                    $state.go('onlinePanel');
                });
        }
    }

})();

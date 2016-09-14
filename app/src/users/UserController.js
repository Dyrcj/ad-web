define([],
    function(){
        function UserController(userService, $scope, $state, $sessionStorage, jwtHelper) {
            $scope.login = function () {
                var data_msg = {
                    username: $scope.username,
                    password: $scope.password
                }
                userService.userLogin(data_msg)
                    .then(function (result) {
                        $sessionStorage.token = result;
                        var tokenJSON = jwtHelper.decodeToken(result);
                        $sessionStorage.userInfo = tokenJSON;
                        $state.go('onlinePanel');
                    }).catch(function (err) {
                        alert(err);
                    });
            }
        }
        return{
            UserController: UserController
        }
    }
)

define([], function(){
    function baseController($scope, $state, $sessionStorage, $location, mainService, jwtHelper) {
        $scope.logout = function () {
            console.log('logout');
            delete $sessionStorage.token;
            delete $sessionStorage.userInfo;
            $state.go('login');
        };
        var tokenLocation = $location.$$absUrl;
        console.log(tokenLocation);
        if(tokenLocation.indexOf('yeepay_sso_token') >= 0) {
            var lastPos = tokenLocation.indexOf('#');
            var token;
            if(lastPos >= 0) {
                token = tokenLocation.substring(tokenLocation.indexOf('=') + 1, tokenLocation.indexOf('#'));
            } else {
                token = tokenLocation.substring(tokenLocation.indexOf('=') + 1, tokenLocation.length);
            }
            console.log('token:' + token);
            mainService.postToken(token)
                .then(function (result) {
                    //alert(result);
                    $sessionStorage.token = result;
                    $sessionStorage.userInfo = jwtHelper.decodeToken(result);
                    console.log($sessionStorage.userInfo);
                    $state.go('onlinePanel');
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    }
    return{
        baseController: baseController
    }
});

(function() {
    'use strict';
    angular.module('sso')
        .controller('ssoController', ['$scope', '$location', '$http', ssoController]);
    function ssoController($scope, $location, $http) {
        var url = "http://10.151.30.80:18009/employee-boss/loginout/ssoValid?returnUrl=http://172.18.63.185:8080/app/#/sso";
        $scope.url = url;
        var tokenLocation = $location.$$absUrl;
        var http = 'http://10.151.30.80:18003/employee-hessian/soaRest/UserFacade/queryAllUsers';
        var params = [];

        $http.post(
            http,
            $.param(params)
        ).then(function (res) {
            console.log(JSON.stringify(res));
        });


        /*if(tokenLocation.indexOf('yeepay_sso_token') >= 0) {
            var token = tokenLocation.substring(tokenLocation.indexOf('=') + 1, tokenLocation.indexOf('#'));

            alert(token);
        }*/

        //$location.path(url);
    }
})();
(function(){
    'use strict';
    angular.module('person')
        .controller('personController',['$scope','personService', '$mdDialog', personController]);
    function personController($scope,personService,$mdDialog){

        $scope.loaded = false;
        $scope.personList = [];

        personService
            .queryAllPerson()
            .then(function (personList) {
                $scope.personList = [].concat(personList);
                $scope.loaded = true;
            });

        /**
         * 为用户添加业务
         * @param ev
         */
        $scope.showAdd = function (ev,userId) {
            $mdDialog.show({
                controller: addBussinessForPersonCtrl,
                templateUrl: '/app/src/persons/view/addBussinessForPerson.html',
                parent: angular.element(document.getElementById('content')),
                targetEvent: ev,
                locals: {userId: userId}
            }).then(function(answer) {
                //alert('You said the information was "' + answer + '".');
                //查询数据库进行更新
                /*
                $scope.initQueryApi = $scope.initQueryApi.concat([
                    {
                        apiServiceName: "fdasfsafsafas",
                        indexName: 'soa-*',
                        aggDsl: 'aggDsl',
                        sign: 'fdsafsaf'
                    }]);
                */
                //$scope.alert = 'You said the information was "' + answer + '".';
            }, function () {
                //$scope.alert = 'You cancelled the dialog.';
            });
        };

        function addBussinessForPersonCtrl($scope, $mdDialog, userId) {
            $scope.loaded = false;
            $scope.businessList = [];
            $scope.noAuthBusinessList = [];
            personService
                .queryBussinessByUser(userId)
                .then(function (data) {
                    $scope.businessList = [].concat(data["authorizedBusinesses"]);
                    $scope.noAuthBusinessList = [].concat(data["unauthorizedBusinesses"]);
                    $scope.loaded = true;
                });

                // $scope.openOffscreen = function(description) {
                //     $mdDialog.show(
                //       $mdDialog.alert()
                //         .clickOutsideToClose(true)
                //         .title('业务描述')
                //         .textContent(description)
                //         .ariaLabel('Offscreen Demo')
                //         .ok('关闭')
                //         .openFrom({
                //           top: -50,
                //           width: 30,
                //           height: 80
                //         })
                //         .closeTo({
                //           left: 1500
                //         })
                //      );
                //   };
                $scope.openMenu = function($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
            $scope.doAddBusinessForUser = function(){
                alert(JSON.stringify($scope.noAuthBusinessList));
                //数据库操作
                $mdDialog.hide();
            };
        };
    }
})();

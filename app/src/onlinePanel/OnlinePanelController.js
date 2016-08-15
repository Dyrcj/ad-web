(function () {
    'use strict';

    angular.module('onlinePanel')
        .controller('onlinePanelMainController', function ($scope, onlinePanelService, $mdBottomSheet, $mdDialog) {
            var thisServerInfo;
            var thisServerID;
            $scope.loaded = false;
            onlinePanelService
                .loadAllBusinesses()
                .then(function (Businesses) {
                    $scope.Businesses = [].concat(Businesses);
                    $scope.loaded = true;
                });
            $scope.getServerInfo = function (serverID) {
                console.log(serverID);
                onlinePanelService.getRemoteServerInfo(serverID)
                    .then(function (serverInfo) {
                        thisServerInfo = serverInfo;
                        $mdBottomSheet.show({
                            controllerAs: "ctrl",
                            templateUrl: '/app/src/onlinePanel/view/ServerInfo.html',
                            controller: ContactSheetController,
                            parent: angular.element(document.getElementById('content'))
                        }).then(function (clickedItem) {
                            $scope.alert = clickedItem['name'] + ' clicked!';
                        });
                    });
            };
            $scope.createBusiness = function (ev) {
                // Appending dialog to document.body to cover sidenav in docs app
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: '/app/src/onlinePanel/view/CreateBusiness.html',
                    parent: angular.element(document.getElementById('content')),
                    targetEvent: ev,
                    clickOutsideToClose: true
                }).then(function (result) {
                    onlinePanelService
                        .loadAllBusinesses()
                        .then(function (Businesses) {
                            $scope.Businesses = [].concat(Businesses);
                        });
                }, function () {
                    onlinePanelService
                        .loadAllBusinesses()
                        .then(function (Businesses) {
                            $scope.Businesses = [].concat(Businesses);
                        });
                });
            };

            function DialogController($scope, $mdDialog) {
                $scope.hide = function () {
                    $mdDialog.hide();
                };
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
            }

            function ContactSheetController() {
                this.serverInfo = thisServerInfo;
                subscribe.subscribe();
                /*this.serverID = thisServerID;*/
            };
        });

})();
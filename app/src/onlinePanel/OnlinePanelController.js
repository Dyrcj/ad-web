(function () {
    'use strict';

    angular.module('onlinePanel')
        .controller('onlinePanelMainController', function ($scope, onlinePanelService, $mdBottomSheet, $mdDialog) {
            var thisServerInfo;
            $scope.loaded = false;
            //$scope.serverInfoLoaded = true;
            onlinePanelService
                .loadAllBusinesses()
                .then(function (Businesses) {
                    $scope.Businesses = [].concat(Businesses);
                    $scope.loaded = true;
                })
                .catch(function (err) {
                    console.log(err);
                    $scope.loaded = true;
                });
            //$scope.serverInfo = thisServerInfo;
            $scope.getServerInfo = function (serverID) {
                $scope.loaded = false;
                onlinePanelService.getRemoteServerInfo(serverID)
                    .then(function (serverInfo) {
                        thisServerInfo = serverInfo;
                        $scope.loaded = true;
                        $mdBottomSheet.show({
                            controllerAs: "ctrl",
                            templateUrl: '/app/src/onlinePanel/view/ServerInfo.html',
                            controller: ContactSheetController,
                            parent: angular.element(document.getElementById('content'))
                        }).then(function () {

                        });
                    })
                    .catch(function (err) {
                        console.log(err);
                        $scope.loaded = true;
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

                $scope.check_email = "";
                $scope.is_email = false;
                $scope.select_check = function () {
                    $scope.is_email = $scope.check_method == 0;
                };
                $scope.submit_create = function () {
                    var method = checkMethod($scope.check_method);
                    var data_msg = {
                        'business_name': $scope.business_name,
                        'git_name': $scope.git_name,
                        'pm': $scope.pm,
                        'audit_type': method,
                        'audit_email': $scope.check_email,
                        'description': $scope.description
                    };
                    onlinePanelService.createBusiness(data_msg)
                        .then(function (result) {
                            alert(result);
                            $mdDialog.hide();
                        });
                };

                function checkMethod(value) {
                    switch (value) {
                        case 0:
                            return 'email';
                            break;
                        case 1:
                            return 'op';
                            break;
                    }
                }
            }

            function ContactSheetController($scope, $sessionStorage, subpub) {
                console.log(JSON.stringify(thisServerInfo));
                $scope.serverInfo = thisServerInfo;
                $scope.openServer = function (serverId) {
                    onlinePanelService.openRemoteServer(serverId)
                        .then(function (result) {
                            console.log(JSON.stringify(result));
                        });
                };
                $scope.closeServer = function (serverId) {
                    onlinePanelService.closeRemoteServer(serverId)
                        .then(function (result) {
                            console.log(JSON.stringify(result));
                        });
                };
                subpub.subscribe({
                    collectionName: 'serverinfo',
                    userId: $sessionStorage.userInfo.user_id,
                    modelId: thisServerInfo.serverId
                }, function (result) {
                    $scope.serverInfo.status = result.status;
                    $scope.serverInfo.log = result.log;
                    $scope.serverInfo.version = result.version;
                    $scope.$apply();
                    //console.log(JSON.stringify($scope.serverInfo));
                });
                /*this.serverID = thisServerID;*/
            };
        });

})();

(function () {
    'use strict';

    angular.module('onlinePanel')
        .controller('onlinePanelMainController', function ($scope, onlinePanelService, $mdToast, $sessionStorage, $mdBottomSheet, $mdColorUtil, $mdColors, subpub) {
            $scope.loaded = false;
            $scope.is_alert = false;
            onlinePanelService
                .loadAllBusinesses()
                .then(function (Businesses) {
                    console.log(JSON.stringify(Businesses));
                    $scope.Businesses = [].concat(Businesses);
                    $scope.loaded = true;
                })
                .catch(function (err) {
                    console.log(err);
/*                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(err)
                            .hideDelay(3000)
                    );*/
                    $scope.loaded = true;
                });

            subpub.subscribe({
                collectionName: 'business',
                userId: $sessionStorage.userInfo.user_id,
                //modelId: $sessionStorage.userInfo.is_admin
                modelId: $sessionStorage.userInfo.user_id
            }, function (Businesses) {
                console.log(JSON.stringify(Businesses));
                if(Businesses['success']) {
                   // $scope.is_alert = false;
                    $scope.Businesses = [].concat(Businesses['message']);
                    $scope.$apply();
                } else {
                   // $scope.is_alert = true;
                    //$scope.alert = Businesses['message'];
                    showToast(Businesses['message']);
                }
            });

            function showToast(message) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(message)
                        .position('top')
                        .hideDelay(3000)
                );
            }

            /*$scope.openMenu = function($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };*/

            $scope.innerTest = function (Business) {
                $mdBottomSheet.show({
                    controllerAs: 'ctrl',
                    templateUrl: '/app/src/onlinePanel/view/InnerTest.html',
                    controller: tryInnerTest,
                    parent: angular.element(document.getElementById('content')),
                    locals: {Business : Business}
                });
            };
            
            function tryInnerTest($scope, $sessionStorage, subpub, Business) {
                $scope.loaded = false;
                console.log(JSON.stringify(Business));
                $scope.businessInfo = Business;
                $scope.serverInfo = Business.servers[0];
                var data = {
                    business_id: Business.business_id
                };

                subpub.subscribe({
                    collectionName: 'online',
                    userId: $sessionStorage.userInfo.user_id,
                    modelId: Business.servers[0].server_id
                }, function (result) {
                    if(result['success']) {
                        $scope.serverInfo.status = result.message.status;
                        $scope.serverInfo.log = result.message.log;
                        $scope.serverInfo.version = result.message.version;
                        $scope.serverInfo.operationStatus = result.message.operationStatus;
                        if($scope.serverInfo.operationStatus[$scope.serverInfo.operationStatus.length - 1] == '提交内测成功' ||
                            $scope.serverInfo.operationStatus[$scope.serverInfo.operationStatus.length - 1] == '提交内测失败') {
                            $scope.loaded = true;
                        }
                        $scope.$apply();
                    } else {
                        showToast(result.message);
                    }
                    console.log(JSON.stringify(result));

                });

                if(Business.operations[0].operation_name == '服务器上线失败' ||
                    Business.operations[0].operation_name == '内测不通过' ) {
                    // alert(Business.operations[0].operation_name)
                    onlinePanelService.innerTest(data)
                        .then(function (results) {
                            console.log(JSON.stringify(results));
                            showToast(JSON.stringify(results));
                        }).catch(function (err) {
                        showToast(JSON.stringify(err));
                    });
                }

                $scope.innerTestFailure = function (business_id) {
                    var data = {
                        business_id: business_id,
                        isInnerTestSuccess: false
                    };
                    onlinePanelService.testStatus(data)
                        .then(function (results) {
                            console.log(JSON.stringify(results));
                            showToast(JSON.stringify(results));
                        })
                        .catch(function (err) {
                            alert(JSON.stringify(err));
                        });
                };

                $scope.innerTestSuccess = function (business_id) {
                    if($scope.serverInfo.operationStatus[$scope.serverInfo.operationStatus.length - 1] == '服务器上线成功') {
                        var data = {
                            business_id: business_id,
                            isInnerTestSuccess: true
                        };
                        onlinePanelService.testStatus(data)
                            .then(function (results) {
                                showToast(JSON.stringify(results));
                            })
                            .catch(function (err) {
                                alert(JSON.stringify(err));
                            });
                    }
                };

            }

            $scope.getServerInfo = function (serverID) {
                $scope.loaded = false;
                onlinePanelService.getRemoteServerInfo(serverID)
                    .then(function (serverInfo) {
                        //thisServerInfo = serverInfo;
                        $scope.loaded = true;
                        $mdBottomSheet.show({
                            controllerAs: "ctrl",
                            templateUrl: '/app/src/onlinePanel/view/ServerInfo.html',
                            controller: ContactSheetController,
                            parent: angular.element(document.getElementById('content')),
                            locals:{serverInfo: serverInfo}
                        }).then(function () {

                        });
                    })
                    .catch(function (err) {
                        console.log(err);
                        $scope.loaded = true;
                    });
            };


            function ContactSheetController($scope, $sessionStorage, subpub, serverInfo) {
                console.log(JSON.stringify(serverInfo));
                $scope.serverInfo = serverInfo;
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
                    modelId: serverInfo.server_id
                }, function (result) {
                    if(result['success']) {
                        $scope.serverInfo.status = result.message.status;
                        $scope.serverInfo.log = result.message.log;
                        $scope.serverInfo.version = result.message.version;
                        $scope.serverInfo.operationStatus = result.message.operationStatus;
                        $scope.$apply();
                    } else {
                        showToast(result.message);
                    }
                    console.log(JSON.stringify(result));
                });
                /*this.serverID = thisServerID;*/
            };
        });

})();

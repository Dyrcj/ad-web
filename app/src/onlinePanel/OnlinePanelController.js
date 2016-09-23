define([],
    function () {
        function onlinePanelMainController($scope, onlinePanelService, $mdToast, $sessionStorage, $mdBottomSheet, $mdDialog, subpub) {
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
                if (Businesses['success']) {
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

            $scope.onlineSuccess = function (Business) {
                var data = {
                    business_id: Business.business_id
                };
                onlinePanelService.onlineSuccess(data)
                    .then(function (result) {
                        $mdDialog.show(alert(result));
                    })
                    .catch(function (err) {
                        $mdDialog.show(alert(err));
                    });
            };

            $scope.onlineSelect = $scope.lastOnlineSelect;

            $scope.lastOnlineSelect = $scope.onlineSelect;

            $scope.serverEnable = function (Business, onlineSelect) {
                if (onlineSelect.operationStatus[onlineSelect.operationStatus.length - 1] == '服务器上线成功' || onlineSelect.operationStatus[onlineSelect.operationStatus.length - 1] == '服务器回滚成功') {
                    var data = {
                        business_id: Business.business_id,
                        servers: "[\"" + onlineSelect.server_ip + "\"]"
                    };
                    onlinePanelService.serversEnable(data)
                        .then(function (result) {
                            $mdDialog.show(alert(JSON.stringify(result)));
                        })
                        .catch(function (err) {
                            $mdDialog.show(alert(JSON.stringify(err)));
                        });
                } else {
                    $mdDialog.show(alert('服务器状态错误'));
                }

            };

            $scope.rollBackFinish = function (Business) {
                var data = {
                    business_id: Business.business_id
                };
                onlinePanelService.rollBackFinish(data)
                    .then(function (result) {
                        $mdDialog.show(alert(result));
                    })
                    .catch(function (err) {
                        $mdDialog.show(alert(err));
                    });
            };

            $scope.rollBack = function (Business, OnlineSelect) {

                if (typeof OnlineSelect == 'undefined' || OnlineSelect == null) {
                    $mdDialog.show(alert('请选择一个服务器回滚'));
                    return;
                }

                $mdBottomSheet.show({
                    controllerAs: 'ctrl',
                    templateUrl: '/app/src/onlinePanel/view/Rollback.html',
                    controller: tryRollBack,
                    parent: angular.element(document.getElementById('content')),
                    locals: {Business: Business, OnlineSelect: OnlineSelect}
                });
            };

            function tryRollBack($scope, $sessionStorage, $location, subpub, Business, OnlineSelect) {
                $scope.loaded = true;
                $scope.businessInfo = Business;
                $scope.serverInfo = OnlineSelect;

                var data = {
                    business_id: Business.business_id,
                    servers: "[\"" + OnlineSelect.server_ip + "\"]"
                };

                subpub.subscribe({
                    collectionName: 'online',
                    userId: $sessionStorage.userInfo.user_id,
                    modelId: OnlineSelect.server_id
                }, function (result) {
                    if (result['success']) {
                        $scope.serverInfo.status = result.message.status;
                        $scope.serverInfo.log = result.message.log;
                        $scope.serverInfo.version = result.message.version;
                        $scope.serverInfo.operationStatus = result.message.operationStatus;
                        if ($scope.serverInfo.operationStatus[$scope.serverInfo.operationStatus.length - 1] == '服务器回滚成功' ||
                            $scope.serverInfo.operationStatus[$scope.serverInfo.operationStatus.length - 1] == '服务器回滚失败') {
                            if (!$scope.loaded) {
                                $mdDialog.show(alert('服务器' + $scope.serverInfo.server_name + '回滚结束'));
                            }
                            $scope.loaded = true;
                        }
                        $scope.$apply();
                    } else {
                        showToast(result.message);
                    }
                    console.log(JSON.stringify(result));

                });

                if (typeof Business.operations[0] == 'undefined' || Business.operations[0].operation_name == '添加tag成功' || Business.operations[0].operation_name == '上线中...'
                    || Business.operations[0].operation_name.indexOf('服务器上线成功')) {
                    $scope.loaded = false;
                    onlinePanelService.rollBack(data)
                        .then(function (results) {
                            console.log(JSON.stringify(results));
                            showToast(JSON.stringify(results));
                        }).catch(function (err) {
                        showToast(JSON.stringify(err));
                    });
                }
            }


            $scope.online = function (Business, OnlineSelect) {

                if (typeof OnlineSelect == 'undefined' || OnlineSelect == null) {
                    return $mdDialog.show(alert('请选择一个服务器上线'));
                }

                if (OnlineSelect.server_type == 'production') {
                    $mdBottomSheet.show({
                        controllerAs: 'ctrl',
                        templateUrl: '/app/src/onlinePanel/view/Online.html',
                        controller: tryOnline,
                        parent: angular.element(document.getElementById('content')),
                        locals: {Business: Business, OnlineSelect: OnlineSelect}
                    });
                } else {
                    return $mdDialog.show(alert('被选中的并不是生产服务器'));
                }

            };

            $scope.innerTest = function (Business, OnlineSelect) {
                /*if (typeof OnlineSelect == 'undefined' || OnlineSelect == null) {
                 return alert('请选择一个内测服务器');
                 }*/
                $mdBottomSheet.show({
                    controllerAs: 'ctrl',
                    templateUrl: '/app/src/onlinePanel/view/InnerTest.html',
                    controller: tryInnerTest,
                    parent: angular.element(document.getElementById('content')),
                    locals: {Business: Business, OnlineSelect: OnlineSelect}
                });
            };

            function tryOnline($scope, $sessionStorage, subpub, Business, OnlineSelect) {
                $scope.loaded = true;
                $scope.businessInfo = Business;
                $scope.serverInfo = OnlineSelect;

                var data = {
                    business_id: Business.business_id,
                    servers: "[\"" + OnlineSelect.server_ip + "\"]"
                };

                subpub.subscribe({
                    collectionName: 'online',
                    userId: $sessionStorage.userInfo.user_id,
                    modelId: OnlineSelect.server_id
                }, function (result) {
                    if (result['success']) {
                        $scope.serverInfo.status = result.message.status;
                        $scope.serverInfo.log = result.message.log;
                        $scope.serverInfo.version = result.message.version;
                        $scope.serverInfo.operationStatus = result.message.operationStatus;
                        if ($scope.serverInfo.operationStatus[$scope.serverInfo.operationStatus.length - 1] == '服务器上线成功' ||
                            $scope.serverInfo.operationStatus[$scope.serverInfo.operationStatus.length - 1] == '服务器上线失败') {
                            if (!$scope.loaded) {
                                $mdDialog.show(alert('服务器' + $scope.serverInfo.server_name + '上线结束'));
                            }
                            $scope.loaded = true;
                        }
                        $scope.$apply();
                    } else {
                        showToast(result.message);
                    }
                    console.log(JSON.stringify(result));

                });

                if (Business.operations[0].operation_name == '审核成功' || Business.operations[0].operation_name.indexOf('服务器上线成功')
                    || Business.operations[0].operation_name.indexOf('服务器上线失败')) {
                    $scope.loaded = false;
                    onlinePanelService.online(data)
                        .then(function (results) {
                            console.log(JSON.stringify(results));
                            showToast(JSON.stringify(results));
                        }).catch(function (err) {
                        showToast(JSON.stringify(err));
                    });
                }
            }

            $scope.sync = function (Business) {

                var data = {
                    business_id: Business.business_id
                };

                if (typeof Business.operations[0] == 'undefined' || Business.operations[0].operation_name == '提交内测失败' ||
                    Business.operations[0].operation_name == '内测不通过') {
                    // alert(Business.operations[0].operation_name)
                    onlinePanelService.sync(data)
                        .then(function (results) {
                            console.log(JSON.stringify(results));
                            showToast(JSON.stringify(results));
                        }).catch(function (err) {
                        showToast(JSON.stringify(err));
                    });
                } else {
                    $mdDialog.show(alert('当前业务状态不能同步代码'));
                }

            };


            function tryInnerTest($scope, $sessionStorage, $location, $mdDialog, subpub, Business) {
                $scope.loaded = true;
                $scope.businessInfo = Business;
                $scope.serverInfo = Business.servers[0];

                subpub.subscribe({
                    collectionName: 'online',
                    userId: $sessionStorage.userInfo.user_id,
                    modelId: Business.servers[0].server_id
                }, function (result) {
                    if (result['success']) {
                        $scope.serverInfo.status = result.message.status;
                        $scope.serverInfo.log = result.message.log;
                        $scope.serverInfo.version = result.message.version;
                        $scope.serverInfo.operationStatus = result.message.operationStatus;
                        if ($scope.serverInfo.operationStatus[$scope.serverInfo.operationStatus.length - 1] == '服务器上线成功' ||
                            $scope.serverInfo.operationStatus[$scope.serverInfo.operationStatus.length - 1] == '服务器上线失败') {
                            if (!$scope.loaded) {
                                $mdDialog.show(alert('提交内测结束'));
                            }
                            $scope.loaded = true;
                        }
                        $scope.$apply();
                    } else {
                        showToast(result.message);
                        $scope.loaded = true;
                    }
                    console.log(JSON.stringify(result));

                });

                if (typeof $scope.serverInfo == 'undefined' || $scope.serverInfo.operationStatus[$scope.serverInfo.operationStatus.length - 1] == '服务器上线成功') {
                    $scope.loaded = true;
                } else {
                    $scope.loaded = false;
                    var data = {
                        business_id: Business.business_id,
                        servers: "[\"" + $scope.serverInfo.server_ip + "\"]"
                    };
                    onlinePanelService.online(data)
                        .then(function (results) {
                            console.log(JSON.stringify(results));
                            showToast(JSON.stringify(results));
                        }).catch(function (err) {
                        showToast(JSON.stringify(err));
                    });
                }

                if ($scope.serverInfo.operationStatus.length == 0) {
                    $scope.loaded = false;
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
                            $mdDialog.show(alert(JSON.stringify(err)));
                            $location.path('/#/onlinePanel');
                        });
                };

                $scope.innerTestSuccess = function (business_id) {
                    if ($scope.serverInfo.operationStatus[$scope.serverInfo.operationStatus.length - 1] == '服务器上线成功') {
                        var data = {
                            business_id: business_id,
                            isInnerTestSuccess: true
                        };
                        onlinePanelService.testStatus(data)
                            .then(function (results) {
                                showToast(JSON.stringify(results));
                            })
                            .catch(function (err) {
                                $mdDialog.show(alert(JSON.stringify(err)));
                            });
                    }
                };

                $scope.innerOP = function (business_id, ev) {
                    if ($scope.serverInfo.operationStatus[$scope.serverInfo.operationStatus.length - 1] == '服务器上线成功') {
                        var confirm = $mdDialog.prompt()
                            .title('请输入工单号')
                            .placeholder('工单号')
                            .ariaLabel('op')
                            .initialValue('')
                            .targetEvent(ev)
                            .ok('Okay!')
                            .cancel('cancel');
                        $mdDialog.show(confirm).then(function (result) {
                            var data = {
                                business_id: business_id,
                                opNumber: result
                            };
                            onlinePanelService.opAudit(data)
                                .then(function (result) {
                                    $mdDialog.show(alert(JSON.stringify(result)));
                                })
                                .catch(function (err) {
                                    $mdDialog.show(alert(JSON.stringify(err)));
                                });
                        }, function () {
                            console.log('cancel');
                        });
                    }
                }

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
                            locals: {serverInfo: serverInfo}
                        }).then(function () {

                        });
                    })
                    .catch(function (err) {
                        console.log(err);
                        $scope.loaded = true;
                    });
            };

            function alert(message) {
                var alert = $mdDialog.alert()
                    .title('alert')
                    .textContent(message)
                    .ok('确定');
                return alert;
            }

            function confirm(message, ev) {
                var confirm = $mdDialog.confirm()
                    .title('warning')
                    .textContent(message)
                    .targetEvent(ev)
                    .ok('Do it!')
                    .cancel('Cancel');
                return confirm;
            }


            function ContactSheetController($scope, $mdDialog, serverInfo, $sessionStorage) {
                console.log(JSON.stringify(serverInfo));
                $scope.serverInfo = serverInfo;
                $scope.openServer = function (serverId, ev) {

                    $mdDialog.show(confirm('确定开启服务器吗', ev)).then(function () {
                        onlinePanelService.openRemoteServer(serverId)
                            .then(function (result) {
                                $mdDialog.show(alert(JSON.stringify(result)));
                            })
                            .catch(function (result) {
                                if (result.indexOf('state.sls tomcat.start concurrent=True --out=json ERROR: Minions returned with non-zero exit code')) {
                                    showToast('服务器已经是开着的了');
                                } else {
                                    showToast('未知错误');
                                }
                            });
                    }, function () {
                        showToast('You decided to keep your debt.');
                    });
                };

                $scope.closeServer = function (serverId, ev) {

                    $mdDialog.show(confirm('确定关闭服务器吗', ev)).then(function () {
                        onlinePanelService.closeRemoteServer(serverId)
                            .then(function (result) {
                                $mdDialog.show(alert(JSON.stringify(result)));
                            })
                            .catch(function (result) {
                                if (result.indexOf('state.sls tomcat.stop concurrent=True --out=json ERROR: Minions returned with non-zero exit code')) {
                                    showToast('服务器已经关闭了');
                                } else {
                                    showToast('未知错误');
                                }
                            });
                    }, function () {
                        showToast('You decided to keep your debt.');
                    });
                };

                subpub.subscribe({
                    collectionName: 'serverinfo',
                    userId: $sessionStorage.userInfo.user_id,
                    modelId: serverInfo.server_id
                }, function (result) {
                    if (result['success']) {
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
            }
        }

        return {
            onlinePanelMainController: onlinePanelMainController
        }
    }
)

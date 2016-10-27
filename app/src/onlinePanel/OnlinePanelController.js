define(['./js/BtnState.js'],
    function (btns) {
        function onlinePanelMainController($scope, onlinePanelService, $mdToast, $sessionStorage, $mdBottomSheet, $mdDialog, subpub) {
            $scope.loaded = false;
            $scope.is_alert = false;
            $sessionStorage.userInfo = $sessionStorage.userInfo || {};

//得到BtnState类
            var BtnState = btns.init($scope, isAllOnline, isAllRollBack);

//所有业务按钮状态初始化
            function initState(Businesses){
                $scope.BusinessState = {};
                for(var i=0;i<Businesses.length;i++){
                    var btns = {};
                    btns['sync_state'] = false;
                    btns['innerOp_state'] = false;
                    btns['innerTest_state'] = false;
                    btns['online_state'] = false;
                    btns['onlineSuccess_state'] = false;
                    btns['rollBackFinish_state'] = false;
                    btns['disable_state'] = false;
                    btns['enable_state'] = false;
                    btns['rollBack_state'] = false;
                    $scope.BusinessState[Businesses[i].business_id] = btns;
                }
            }

//针对特定服务器的操作
            function forServer(business_id){
                $scope.BusinessState[business_id]['disable_state'] = false;
                $scope.BusinessState[business_id]['enable_state'] = false;
                $scope.BusinessState[business_id]['rollBack_state'] = false;
                if(isAllRollBack(business_id)){
                    $scope.BusinessState[business_id]['rollBackFinish_state'] = false;
                }
            }

//初始化页面
            onlinePanelService
                .loadAllBusinesses()
                .then(function (Businesses) {
                    $sessionStorage.checkedRadio = null;
                    $scope.Businesses = [].concat(Businesses);
                    $scope.serverMap = {};
                    $scope.Loadeds = {};

                    initState(Businesses);

                    // new BtnState(Businesses[0].business_id).updateState('state11');

                    for(var i=0;i<$scope.Businesses.length;i++){
                        var servers = [].concat($scope.Businesses[i]['servers']);
                        $scope.serverMap[$scope.Businesses[i]['business_id']] = {};
                        $scope.Loadeds[$scope.Businesses[i]['business_id']] = true;
                        for(var j=0;j<servers.length;j++){
                            $scope.serverMap[$scope.Businesses[i]['business_id']][servers[j]['server_id']] = servers[j];
                        }
                    }
                    $scope.loaded = true;

                })
                .catch(function (err) {
                    $scope.loaded = true;
                });
            subpub.subscribe({
                collectionName: 'business',
                userId: $sessionStorage.userInfo.user_id,
                modelId: $sessionStorage.userInfo.is_admin
                // modelId: $sessionStorage.userInfo.user_id
            }, function (Businesses) {
                if (Businesses['success']) {
                    $scope.Businesses = [].concat(Businesses['message']);
        // console.log(JSON.stringify($scope.Businesses))
                    $scope.serverMap = {};
                    $scope.Loadeds = {};
                    for(var i=0;i<$scope.Businesses.length;i++){
                        var servers = [].concat($scope.Businesses[i]['servers']);
                        $scope.serverMap[$scope.Businesses[i]['business_id']] = {};
                        $scope.Loadeds[$scope.Businesses[i]['business_id']] = true;
                        for(var j=0;j<servers.length;j++){
                            $scope.serverMap[$scope.Businesses[i]['business_id']][servers[j]['server_id']] = servers[j];
                        }
                    }

                    $scope.onlineSelect = $sessionStorage.checkedRadio;
                    $scope.$apply();
                } else {
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

//刷新页面时保持radio
            $scope.keepRadio = function(onlineSelect, business_id){
                $sessionStorage.checkedRadio = onlineSelect;
                forServer(business_id);
            }

//自定义alert
            function alert(message) {
                var alert = $mdDialog.alert()
                    .title('alert')
                    .textContent(message)
                    .ok('确定');
                return alert;
            }

//自定义confirm
            function confirm(message, ev) {
                var confirm = $mdDialog.confirm()
                    .title('warning')
                    .textContent(message)
                    .targetEvent(ev)
                    .ok('Do it!')
                    .cancel('Cancel');
                return confirm;
            }

//同步代码
            $scope.sync = function (Business) {
                $sessionStorage.checkedRadio = null;
                // refreshState(Business.business_id);

                var data = {
                    business_id: Business.business_id
                };
                $scope.Loadeds[Business.business_id] = false;
                onlinePanelService
                    .sync(data)
                    .then(function (results) {
                        $scope.Loadeds[Business.business_id] = true;
                        $mdDialog.show(alert(result));
                        $scope.BusinessState[Business.business_id]['innerOp_state'] = false;
                    })
                    .catch(function (err) {
                        $scope.Loadeds[Business.business_id] = true;
                        $mdDialog.show(alert(err));
                        // $scope.BusinessState[Business.business_id]['sync_state'] = false;
                        $scope.BusinessState[Business.business_id]['innerOp_state'] = false;
                    });

            };

//提交审核
            $scope.innerOP = function (business_id, ev) {

                // refreshState(business_id);
                var confirm = $mdDialog.prompt()
                    .title('请输入工单号')
                    .placeholder('工单号')
                    .ariaLabel('op')
                    .initialValue('')
                    .targetEvent(ev)
                    .ok('Okay!')
                    .cancel('cancel');

                $scope.Loadeds[business_id] = false;
                $mdDialog.show(confirm).then(function (result){
                    var data = {
                        business_id: business_id,
                        opNumber: result
                    };
                    onlinePanelService.opAudit(data)
                        .then(function (result) {
                            $scope.Loadeds[business_id] = true;
                            $mdDialog.show(alert(result));
                            // $scope.BusinessState[business_id]['innerTest_state'] = false;
                        })
                        .catch(function (err) {
                            $scope.Loadeds[business_id] = true;
                            $mdDialog.show(alert(err));
                            // $scope.BusinessState[business_id]['innerOp_state'] = false;
                            // $scope.BusinessState[business_id]['sync_state'] = false;
                        });
                });
            }

//提交内测
            $scope.innerTest = function (Business) {
                $mdBottomSheet.show({
                    controllerAs: 'ctrl',
                    templateUrl: '/app/src/onlinePanel/view/InnerTest.html',
                    controller: tryInnerTest,
                    parent: angular.element(document.getElementById('content')),
                    scope: $scope,
                    preserveScope: true,
                    locals: {Business: Business}
                });
            };

//提交内测 controller
            function tryInnerTest($scope, $sessionStorage, $location, $mdDialog, subpub, Business) {
                $scope.loaded_innerTest = false;
                $scope.businessInfo = Business;
                $scope.serverInfo = Business.servers[0];
                $sessionStorage.checkedRadio = null;

                // refreshState(Business.business_id);

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
                            if (!$scope.loaded_innerTest) {
                                $mdDialog.show(alert('提交内测结束'));
                                $scope.loaded_innerTest = true;
                            }
                        }
                        $scope.$apply();
                    } else {
                        showToast(result.message);
                        $scope.loaded_innerTest = true;
                    }
                });

                if (typeof $scope.serverInfo == 'undefined' || $scope.serverInfo.operationStatus[$scope.serverInfo.operationStatus.length - 1] == '服务器上线成功') {
                    $scope.loaded_innerTest = true;
                } else {
                    $scope.loaded_innerTest = false;
                    var data = {
                        business_id: Business.business_id
                    };
                    onlinePanelService.innerTest(data)
                        .then(function (results) {
                            showToast(results);
                            // $scope.BusinessState[Business.business_id]['innerTest_state'] = false;
                        })
                        .catch(function (err) {
                            showToast(err);
                            // $scope.BusinessState[Business.business_id]['innerTest_state'] = false;
                    });
                }

                if ($scope.serverInfo.operationStatus.length == 0) {
                    $scope.loaded_innerTest = false;
                }

                $scope.innerTestFailure = function (business_id) {
                    // state = refreshState(Business.business_id);
                    var data = {
                        business_id: business_id,
                        isInnerTestSuccess: false
                    };
                    onlinePanelService.testStatus(data)
                        .then(function (results) {
                            showToast(results);
                            // $scope.BusinessState[Business.business_id]['sync_state'] = false;
                        })
                        .catch(function (err) {
                            $mdDialog.show(alert(err));
                            $location.path('/#/onlinePanel');
                            // $scope.BusinessState[Business.business_id]['sync_state'] = false;
                        });
                };

                $scope.innerTestSuccess = function (business_id) {
                    // state = refreshState(Business.business_id);
                    if ($scope.serverInfo.operationStatus[$scope.serverInfo.operationStatus.length - 1] == '服务器上线成功') {
                        var data = {
                            business_id: business_id,
                            isInnerTestSuccess: true
                        };
                        onlinePanelService
                            .testStatus(data)
                            .then(function (results) {
                                showToast(results);
                                // $scope.BusinessState[Business.business_id]['online_state'] = false;
                            })
                            .catch(function (err) {
                                $mdDialog.show(alert(err));
                                // $scope.BusinessState[Business.business_id]['sync_state'] = false;
                                // $scope.BusinessState[Business.business_id]['online_state'] = false;
                            });
                    }
              };
            }

//上线
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
                        scope: $scope,
                        preserveScope: true,
                        locals: {Business: Business, OnlineSelect: OnlineSelect}
                    });
                } else {
                    return $mdDialog.show(alert('被选中的并不是生产服务器'));
                }

            };

//上线 controller
            function tryOnline($scope, $sessionStorage, subpub, Business, OnlineSelect) {
                $scope.loaded_online = true;
                // $scope.BusinessState[Business.business_id]['onlineSuccess_state'] = true;
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
                            if (!$scope.loaded_online) {
                                $mdDialog.show(alert('服务器' + $scope.serverInfo.server_name + '上线结束'));
                                $scope.loaded_online = true;
                                // if(isAllOnline(Business.business_id)){
                                //     $scope.BusinessState[Business.business_id]['onlineSuccess_state'] = false;
                                // }
                            }
                        }
                        $scope.$apply();
                    } else {
                        showToast(result.message);
                    }
                });

                if (Business.operations[0].operation_name == '审核成功' || Business.operations[0].operation_name.indexOf('服务器上线成功')
                    || Business.operations[0].operation_name.indexOf('服务器上线失败')) {
                    $scope.loaded_online = false;
                    onlinePanelService.online(data)
                        .then(function (results) {
                            showToast(JSON.stringify(results));
                        }).catch(function (err) {
                        showToast(JSON.stringify(err));
                    });
                }
            }

//判断是否所有服务器都已完成上线
            function isAllOnline(business_id){
                var finish = true;
                for(var i=0;i<$scope.Businesses.length;i++){
                    if($scope.Businesses[i]['business_id'] == business_id){
                        var servers = $scope.Businesses[i]['servers'];
                    }
                }
                for(var i=0;i<servers.length;i++){
      console.log(servers[i]['operationStatus'][servers[i]['operationStatus'].length - 1]);
                    if(servers[i]['operationStatus'][servers[i]['operationStatus'].length - 1] != '服务器上线成功'){
                        finish = false;
                        break;
                    }
                }
                return finish;
            }

//上线完成
            $scope.onlineSuccess = function (Business) {

                $sessionStorage.checkedRadio = null;
                // refreshState(Business.business_id);

                var data = {
                    business_id: Business.business_id
                };
                $scope.loaded = false;
                onlinePanelService.onlineSuccess(data)
                    .then(function (result) {
                        $scope.loaded = true;
                        $mdDialog.show(alert(result));
                        // $scope.BusinessState[Business.business_id]['sync_state'] = false;
                    })
                    .catch(function (err) {
                        $scope.loaded = true;
                        $mdDialog.show(alert(err));
                        // $scope.BusinessState[Business.business_id]['online_state'] = false;
                    });
            };

//对内
            $scope.serverDisable = function(onlineSelect, business_id){
                var ips = [];
                $scope.Loadeds[business_id] = false;
                ips.push(onlineSelect.server_ip);
                var data = {
                    servers:JSON.stringify(ips)
                };

                onlinePanelService.serversDisable(data)
                   .then(function(result){
                       $mdDialog.show(alert(JSON.stringify(result)));
                       $scope.Loadeds[business_id] = true;
                   })
                   .catch(function(err){
                       $mdDialog.show(alert(JSON.stringify(err)));
                       $scope.Loadeds[business_id] = true;
                   });
            }

//对外
            $scope.serverEnable = function (onlineSelect, business_id) {

                // if (onlineSelect.operationStatus[onlineSelect.operationStatus.length - 1] == '服务器上线成功' || onlineSelect.operationStatus[onlineSelect.operationStatus.length - 1] == '服务器回滚成功' || onlineSelect.operationStatus[onlineSelect.operationStatus.length - 1].indexOf('负载均衡对外成功')!=-1) {
                //     $scope.loaded = false;
                //     var data = {
                //         business_id: Business.business_id,
                //         servers: "[\"" + onlineSelect.server_ip + "\"]"
                //     };
                //     onlinePanelService.serversEnable(data)
                //         .then(function (result) {
                //             $scope.loaded = true;
                //             $mdDialog.show(alert(JSON.stringify(result)));
                //         })
                //         .catch(function (err) {
                //             $scope.loaded = true;
                //             $mdDialog.show(alert(JSON.stringify(err)));
                //         });
                // } else {
                //     $mdDialog.show(alert('服务器状态错误'));
                // }
                var ips = [];
                $scope.Loadeds[business_id] = false;
                ips.push(onlineSelect.server_ip)
                var data = {
                    servers:JSON.stringify(ips)
                };

                onlinePanelService.serversEnable(data)
                   .then(function(result){
                       $mdDialog.show(alert(JSON.stringify(result)));
                       $scope.Loadeds[business_id] = true;
                   })
                   .catch(function(err){
                       $mdDialog.show(alert(JSON.stringify(err)));
                       $scope.Loadeds[business_id] = true;
                   });


            };

//回滚
            $scope.rollBack = function (Business, OnlineSelect) {

                $sessionStorage.checkedRadio = null;

                if (typeof OnlineSelect == 'undefined' || OnlineSelect == null) {
                    $mdDialog.show(alert('请选择一个服务器回滚'));
                    return;
                }

                $mdBottomSheet.show({
                    controllerAs: 'ctrl',
                    templateUrl: '/app/src/onlinePanel/view/Rollback.html',
                    controller: tryRollBack,
                    parent: angular.element(document.getElementById('content')),
                    scope: $scope,
                    preserveScope: true,
                    locals: {Business: Business, OnlineSelect: OnlineSelect}
                });
            };

//回滚 controller
            function tryRollBack($scope, $sessionStorage, $location, subpub, Business, OnlineSelect) {
                $scope.loaded_rollback = true;
                // $scope.BusinessState[Business.business_id]['rollBackFinish_state'] = true;
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
                            if (!$scope.loaded_rollback) {
                                $mdDialog.show(alert('服务器' + $scope.serverInfo.server_name + '回滚结束'));
                                $scope.loaded_rollback = true;
                                // if(isAllRollBack(Business.business_id)){
                                //     $scope.BusinessState[Business.business_id]['rollBackFinish_state'] = false;
                                // }
                            }
                        }
                        $scope.$apply();
                    } else {
                        showToast(result.message);
                    }
                });

                if (typeof Business.operations[0] == 'undefined' || Business.operations[0].operation_name == '添加tag成功' || Business.operations[0].operation_name == '上线中...'
                    || Business.operations[0].operation_name.indexOf('服务器上线成功')) {
                    $scope.loaded_rollback = false;
                    onlinePanelService.rollBack(data)
                        .then(function (results) {
                            showToast(JSON.stringify(results));
                        }).catch(function (err) {
                        showToast(JSON.stringify(err));
                    });
                }
            }

//判断是否所有服务器都已完成回滚
            function isAllRollBack(business_id){
                var finish = true;
                for(var i=0;i<$scope.Businesses.length;i++){
                    if($scope.Businesses[i]['business_id'] == business_id){
                        var servers = $scope.Businesses[i]['servers'];
                    }
                }

                for(var i=1;i<servers.length;i++){
                    if(servers[i]['version'] != servers[0]['version']){
                        finish = false;
                        break;
                    }
                }
                return finish;
            }


//回滚完成
            $scope.rollBackFinish = function (Business) {

                $sessionStorage.checkedRadio = null;

                var data = {
                    business_id: Business.business_id
                };
                $scope.loaded = false;
                onlinePanelService.rollBackFinish(data)
                    .then(function (result) {
                        $scope.loaded = true;
                        $mdDialog.show(alert(result));
                        $scope.onlineSelect = null;
                        // initState($scope.Businesses);
                    })
                    .catch(function (err) {
                        $scope.loaded = true;
                        $mdDialog.show(alert(err));
                    });
            };

//服务器启动日志
            $scope.getServerInfo = function (serverID) {
                $scope.loaded = false;
                onlinePanelService.getRemoteServerInfo(serverID)
                    .then(function (serverInfo) {
                        $scope.loaded = true;
                        $mdBottomSheet.show({
                            controllerAs: "ctrl",
                            templateUrl: '/app/src/onlinePanel/view/ServerInfo.html',
                            controller: ContactSheetController,
                            parent: angular.element(document.getElementById('content')),
                            scope: $scope,
                            preserveScope: true,
                            locals: {serverInfo: serverInfo}
                        }).then(function () {

                        });
                    })
                    .catch(function (err) {
                        $scope.loaded = true;
                    });
            };

//服务器启动日志 controller
            function ContactSheetController($scope, $mdDialog, serverInfo, $sessionStorage) {
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
                });
            }
        }

        return {
            onlinePanelMainController: onlinePanelMainController
        }
    }
)

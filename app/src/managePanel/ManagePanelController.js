(function(){
    'use strict';
    angular.module('managePanel')
        .controller('ManagePanelController', ['$scope', '$mdDialog', 'ManagePanelService', ManagePanelController]);

    function ManagePanelController($scope, $mdDialog, ManagePanelService){
        $scope.loaded = false;
        ManagePanelService
            .loadAllBusinesses()
            .then(function(business){
                $scope.Businesses = [].concat(business);
                $scope.loaded = true;
            });

//创建业务
        $scope.createBusiness = function (ev) {
            $mdDialog.show({
                controller: DialogBusinessController,
                templateUrl: '/app/src/managePanel/view/CreateBusiness.html',
                parent: angular.element(document.getElementById('content')),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function () {
                updateBusinesses();
            }, function () {
                updateBusinesses();
            });
        };

        function DialogBusinessController($scope, $mdDialog) {
            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };

            $scope.check_email = "";
            $scope.is_email = false;
            $scope.select_check = function () {
                if($scope.check_method == 0)
                    $scope.is_email = true;
                else
                    $scope.is_email = false;
                console.log($scope.is_email);
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
                ManagePanelService.createBusiness(data_msg)
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

//修改业务
        var id;//业务id
        $scope.modifyBusiness = function(business_id){
            id = business_id;
            $mdDialog.show({
                controller: DialogModifyController,
                templateUrl: '/app/src/managePanel/view/ModifyBusiness.html',
                parent: angular.element(document.getElementById('content')),
                clickOutsideToClose: true
            }).then(function () {
                updateBusinesses();
            }, function () {
                updateBusinesses();
            });
        }

        function DialogModifyController($scope, $mdDialog){
            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };


            $scope.select_check = function () {
                if($scope.check_method == 0)
                    $scope.is_email = true;
                else
                    $scope.is_email = false;
            };

            ManagePanelService
                .getTheBusiness(id)
                .then(function(business){
                    $scope.business_name = business['name'];
                    $scope.git_name = business['git_name'];
                    $scope.pm = business['pm'];
                    $scope.check_method = checkMethod2(business['audit_type']);
                    $scope.check_email = business['audit_email'];
                    $scope.description = business['description'];
                    $scope.select_check();
                });

            $scope.submit_create = function () {
                var method = checkMethod1($scope.check_method);
                var data_msg = {
                    'name': $scope.business_name,
                    'git_name': $scope.git_name,
                    'pm': $scope.pm,
                    'audit_type': method,
                    'audit_email': $scope.check_email,
                    'description': $scope.description,
                    'business_id': id
                };
                console.log(JSON.stringify(data_msg))
                ManagePanelService.modifyTheBusiness(data_msg)
                    .then(function (result) {
                        alert(result);
                        $mdDialog.hide();
                    });
            };

            function checkMethod1(value) {
                switch (value) {
                    case 0:
                        return 'email';
                        break;
                    case 1:
                        return 'op';
                        break;
                }
            }
            function checkMethod2(value) {
                switch (value) {
                    case 'email':
                        return 0;
                        break;
                    case 'op':
                        return 1;
                        break;
                }
            }

        }

//删除业务
        $scope.deleteBusiness = function(business_id){
            ManagePanelService
                .deleteTheBusiness(business_id)
                .then(function(result){
                    alert(result);
                    updateBusinesses();
                });
        }

//业务相关
        $scope.AssociateBusiness = function (business_id) {
            id = business_id;
            $mdDialog.show({
                controller: AssociateBusinessController,
                templateUrl: '/app/src/managePanel/view/AssociateBusiness.html',
                parent: angular.element(document.getElementById('content')),
                clickOutsideToClose: true
            }).then(function () {
                ManagePanelService
                    .getAssociateServers(id)
                    .then(function(servers){
                        $scope.Servers = [].concat(servers);
                        for(var i in servers){
                            $scope.items.push(servers[i]['server_id']);
                        }
                    });
            }, function () {
                ManagePanelService
                    .getAssociateServers(id)
                    .then(function(servers){
                        $scope.Servers = [].concat(servers);
                        for(var i in servers){
                            $scope.items.push(servers[i]['server_id']);
                        }
                    });
            });
        };

        function AssociateBusinessController($scope, $mdDialog) {
            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };

            $scope.items = [];
            $scope.loaded = false;
            ManagePanelService
                .getAssociateServers(id)
                .then(function(servers){
                    $scope.Servers = [].concat(servers);
                    $scope.loaded = true;
                    for(var i in servers){
                        $scope.items.push(servers[i]['server_id']);
                    }
                });
            $scope.is_delete = false;
            $scope.is_add = false;
            $scope.addServer = function(){
                $scope.is_add = true;
            }
            $scope.deleteServer = function(){
                $scope.is_delete = true;
            }
            $scope.remove = function(){
                $scope.is_add = false;
                $scope.is_delete = false;
            }

            //处理复选框
            $scope.selected = [];
            $scope.toggle = function (item, list) {
                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    list.push(item);
                }
            };
            $scope.exists = function (item, list) {
                return list.indexOf(item) > -1;
            };
            $scope.isIndeterminate = function() {
                return ($scope.selected.length !== 0 &&
                $scope.selected.length !== $scope.items.length);
            };
            $scope.isChecked = function() {
                return $scope.selected.length === $scope.items.length;
            };
            $scope.toggleAll = function() {
                if ($scope.selected.length === $scope.items.length) {
                    $scope.selected = [];
                } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                    $scope.selected = $scope.items.slice(0);
                }
            };

            var types = ['test','production']
            $scope.operation = function(){
//添加相关服务器
                if($scope.is_add){
                    var data = {
                        'server_name':$scope.name,
                        'server_ip':$scope.ip,
                        'server_type':types[$scope.type],
                        'business_id':id
                    }
                    ManagePanelService
                        .postAssociateServer(data)
                        .then(function(result){
                            alert(result);
                            $scope.is_add = false;
                            $scope.name = "";
                            $scope.ip = "";
                            $scope.type = "";
                            ManagePanelService
                                .getAssociateServers(id)
                                .then(function(servers){
                                    $scope.Servers = [].concat(servers);
                                });
                        });
                }
//删除相关服务器
                else{
                    if($scope.selected){
                        var data = {
                            'serverIds':$scope.selected
                        };
                        ManagePanelService
                            .deleteAssociateServer(data)
                            .then(function(res){
                                alert(res);
                                $scope.is_delete = false;
                                ManagePanelService
                                    .getAssociateServers(id)
                                    .then(function(servers){
                                        $scope.Servers = [].concat(servers);
                                    });
                            });
                    }
                }
            }
        }

        function updateBusinesses() {
            ManagePanelService
                .loadAllBusinesses()
                .then(function(business){
                    $scope.Businesses = [].concat(business);
                });
        }

    }

    function validate_isNull(input){
        return input == undefined;
    }
    function validate_isvaild(input,pattern){
        return input.test(pattern);
    }
})();
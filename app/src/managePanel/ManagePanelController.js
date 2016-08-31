(function(){
    'use strict';
    angular.module('managePanel')
        .controller('ManagePanelController', ['$scope', '$mdDialog', 'ManagePanelService', ManagePanelController]);

    function ManagePanelController($scope, $mdDialog, ManagePanelService){

        var id;//业务id
        $scope.loaded = false;
        var check_types = ['email','op'];
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

            // $scope.check_email = "";
            // $scope.is_email = false;
            // $scope.select_check = function () {
            //     if($scope.check_method == 0)
            //         $scope.is_email = true;
            //     else
            //         $scope.is_email = false;
            // };
            $scope.submit_create = function () {
                var data_msg = {
                    'business_name': $scope.business_name,
                    'git_name': $scope.git_name,
                    'pm': $scope.pm,
                    'audit_type': check_types[1],
                    // 'audit_email': $scope.check_email,
                    'description': $scope.description
                };
                ManagePanelService.createBusiness(data_msg)
                    .then(function (result) {
                        alert(result);
                        $mdDialog.cancel();
                    });
            };
        }

//修改业务
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


            // $scope.select_check = function () {
            //     if($scope.check_method == 0)
            //         $scope.is_email = true;
            //     else
            //         $scope.is_email = false;
            // };

            $scope.loaded = false;
            ManagePanelService
                .getTheBusiness(id)
                .then(function(business){
                    $scope.loaded = true;
                    $scope.business_name = business['name'];
                    $scope.git_name = business['git_name'];
                    $scope.pm = business['pm'];
                    // $scope.check_method = check_types.indexOf(business['audit_type']);
                    // $scope.check_email = business['audit_email'];
                    $scope.description = business['description'];
                    // $scope.select_check();
                });

            $scope.submit_create = function () {
                // var method = checkMethod1($scope.check_method);
                var data_msg = {
                    'name': $scope.business_name,
                    'git_name': $scope.git_name,
                    'pm': $scope.pm,
                    'audit_type': check_types[1],
                    // 'audit_email': $scope.check_email,
                    'description': $scope.description,
                    'business_id': id
                };
                ManagePanelService.modifyTheBusiness(data_msg)
                    .then(function (result) {
                        alert(result);
                        $mdDialog.hide();
                    });
            };
        }

//删除业务
        $scope.deleteBusiness = function(business_id){
            if(confirm('是否要删除？')){
              ManagePanelService
                  .deleteTheBusiness(business_id)
                  .then(function(result){
                      alert(result);
                      updateBusinesses();
                  });
            }
        }

//业务相关
        $scope.AssociateBusiness = function (business_id) {
            id = business_id;
            $scope.items = [];
            $mdDialog.show({
                controller: AssociateBusinessController,
                templateUrl: '/app/src/managePanel/view/AssociateBusiness.html',
                parent: angular.element(document.getElementById('content')),
                clickOutsideToClose: true
            });
        };

//业务相关信息
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

//服务器信息
            updateServers();
            $scope.items = [];
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
                emptyServerVal();
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
                    var reg = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
                    if($scope.name==""||$scope.name==undefined){
                        alert('服务器名称不能为空！');
                        return;
                    }
                    if($scope.type==""||$scope.type==undefined){
                        alert('请选择服务器类型！');
                        return;
                    }
                    if(!reg.test($scope.ip)){
                        alert('IP格式不正确！');
                        return;
                    }
                    if($scope.port==""||$scope.port==undefined){
                        alert('服务器端口号不能为空！');
                        return;
                    }
                    var data = {
                        'server_name':$scope.name,
                        'server_ip':$scope.ip,
                        'server_port':$scope.port,
                        'server_type':types[$scope.type],
                        'business_id':id
                    }
                    // console.log(JSON.stringify(data))
                    ManagePanelService
                        .postAssociateServer(data)
                        .then(function(result){
                            alert(result);
                            $scope.is_add = false;
                            emptyServerVal();
                            updateServers();
                        });
                }
    //删除相关服务器
                else{
                    if($scope.selected.length>0){
                        if(confirm('是否要删除？')){
                          var data = {
                              'serverIps':JSON.stringify($scope.selected)
                          };
                          ManagePanelService
                              .deleteAssociateServer(data)
                              .then(function(res){
                                  if(typeof res == 'string')
                                      alert(res);
                                  else{
                                      var msg = '错误信息：\n';
                                      for(var i in res){
                                        msg += res[i]['serverIp'] + ':' + res[i]['message'] + '\n';
                                      }
                                      alert(msg);
                                  }
                                  $scope.is_delete = false;
                                  $scope.selected = [];
                                  updateServers();
                              });
                        }
                    }
                }
            }
            function updateServers(){
                $scope.loaded = false;
                ManagePanelService
                    .getAssociateServers(id)
                    .then(function(servers){
                        $scope.Servers = [].concat(servers);
                        $scope.loaded = true;
                        for(var i in servers){
                            $scope.items.push(servers[i]['server_ip']);
                        }
                    });
            }
            function emptyServerVal(){
                $scope.name = "";
                $scope.ip = "";
                $scope.type = "";
                $scope.selected = [];
                $scope.port = "";
            }

//人员信息
            emptyPersonVal();
            updatePersons();

            $scope.delete_per = false;
            $scope.add_per = false;
            $scope.addPerson = function(){
                $scope.add_per = true;
                $scope.loaded4 = true;
                ManagePanelService
                    .getAssociateDepartments()
                    .then(function(res){
                        for(var i=0;i<res.length;i++){
                          $scope.departments.push({
                            id:i,
                            name:res[i]
                          });
                        }
                        getDept();
                    });
            }
            $scope.deletePerson = function(){
                $scope.delete_per = true;
            }
            $scope.cancelPerson = function(){
                $scope.add_per = false;
                $scope.delete_per = false;
                emptyPersonVal();
                updatePersons();
            }

            //处理复选框
            $scope.selectedPerson = [];//要删除的人员
            $scope.toggle2 = function (item, list) {
                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    list.push(item);
                }
            };
            $scope.exists2 = function (item, list) {
                return list.indexOf(item) > -1;
            };
            $scope.isChecked2 = function() {
                return $scope.selectedPerson.length === $scope.Persons.length;
            };
            $scope.toggleAll2 = function() {
                if ($scope.selectedPerson.length === $scope.Persons.length) {
                    $scope.selectedPerson = [];
                } else if ($scope.selectedPerson.length === 0 || $scope.selectedPerson.length > 0) {
                    $scope.selectedPerson = $scope.Persons.slice(0);
                }
            };
            $scope.selectDept = getDept;
            function getDept(){
                var dept = $scope.departments[$scope.selectedDept].name;
                $scope.personsInDept = [];
                $scope.selectedPersonDept = "";
                $scope.loaded4 = false;
                var names = [];
                for(var i in $scope.PersonsInfo){
                    names.push($scope.PersonsInfo[i]['name']);
                }
                ManagePanelService
                    .getAssociatePersonsInDept(dept)
                    .then(function(res){
                        var index = 0;
                        for(var i in res){
                          var u_name = res[i]['userName'];
                          if(names.indexOf(u_name)<0){
                            $scope.personsInDept.push({
                                id:index++,
                                name:u_name
                              });
                          }
                        }
                        $scope.loaded4 = true;
                    });
            }
            $scope.selectPersonDept = function(){
                var name = $scope.personsInDept[$scope.selectedPersonDept].name;
                var dept = $scope.departments[$scope.selectedDept].name;
                var selected = name+'['+dept+']';
                if($scope.selected_persons.indexOf(selected)<=-1){
                    $scope.selected_persons.push(selected);
                }
            }
            $scope.subPersons = function(){
      //添加人员
                if($scope.add_per){
                    var select = [];
                    var persons = $scope.selected_persons;
                    for(var i in persons){
                        var index = persons[i];
                        select.push(index.slice(0,index.indexOf('[')));
                    }
                    if(select.length>0){
                        var data = {
                            businessId:id,
                            userNames:JSON.stringify(select)
                        }
                        ManagePanelService
                            .postAssociatePersons(data)
                            .then(function(res){
                                if(typeof res == 'string')
                                    alert(res);
                                else{
                                  var msg = '错误信息\n';
                                  for(var i in res){
                                    msg += res[i].username + ':' + res[i].message + '\n';
                                  }
                                  alert(msg);
                                }
                                $scope.add_per = false;
                                emptyPersonVal();
                                updatePersons();
                            });
                    }

                }
      //删除人员
                else{
                    if($scope.selectedPerson.length>0){
                        if(confirm('是否要删除？')){
                          var data = {
                              businessId:id,
                              userNames:JSON.stringify($scope.selectedPerson)
                          }
                          ManagePanelService
                            .deleteAssociatePersons(data)
                            .then(function(res){
                                if(typeof res == 'string')
                                    alert(res);
                                else{
                                  var msg = '错误信息\n';
                                  for(var i in res){
                                    msg += res[i].username + ':' + res[i].message + '\n';
                                  }
                                  alert(msg);
                                }
                                emptyPersonVal();
                                updatePersons();
                            });
                        }
                    }
                }
            }
            function updatePersons(){
                $scope.loaded3 = false;
                ManagePanelService
                    .getAssociatePersons(id)
                    .then(function(res){
                        $scope.PersonsInfo = res;
                        for(var i in res){
                          $scope.Persons.push(res[i]['name']);
                        }
                        $scope.loaded3 = true;
                    });
            }
            function emptyPersonVal(){
                $scope.PersonsInfo = [];//人员列表显示
                $scope.Persons = [];//所有人员 id
                $scope.personsInDept = [];
                $scope.selected_persons = [];//选中的人员
                $scope.departments = [];
                $scope.personsInDept = [];
                $scope.selectedDept = 0;
            }
//负载均衡信息
            updatePool();
            $scope.addLB = function(){
                $scope.add_pool = true;
                $scope.no_pool = false;
                ManagePanelService
                    .getPools()
                    .then(function(res){
                        $scope.Pools = [].concat(res);
                    });
            }
            $scope.delLB = function(lb_id){
                if(confirm('是否要删除？')){
                  ManagePanelService
                      .deletePool(lb_id)
                      .then(function(res){
                          alert(res)
                          updatePool();
                      });
                }
            }
            $scope.cancelAdd = function(){
                $scope.add_pool = false;
                $scope.no_pool = true;
            }

            $scope.submitAdd = function(){
                var data = {
                    business_id:id,
                    pool_id:$scope.Pools[$scope.selectedLBPool]['pool_id']
                }
                ManagePanelService
                    .postPool(data)
                    .then(function(res){
                        alert(res);
                        updatePool();
                    });
            }
            function updatePool(){
                $scope.no_pool = false;
                $scope.add_pool = false;
                $scope.has_pool = false;
                $scope.loaded5 = false;
                ManagePanelService
                    .getPool(id)
                    .then(function(res){
                        if(res){
                          $scope.has_pool = true;
                          $scope.pool_msg = res;
                        }
                        else{
                          $scope.no_pool = true;
                        }
                        $scope.loaded5 = true;
                    });
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
})();

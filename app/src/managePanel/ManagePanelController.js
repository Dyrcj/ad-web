define([],
    function(){

      function ManagePanelController($scope, $mdDialog, ManagePanelService, $state){
          var id;//业务id
          $scope.loaded = false;
          var check_types = ['email','op'];
          ManagePanelService
              .loadAllBusinesses()
              .then(function(business){
                  $scope.Businesses = [].concat(business);
                  $scope.loaded = true;
              })
              .catch(function(err){
                  alert(err);
              });

  //创建业务
          $scope.createBusiness = function (ev) {
              $mdDialog.show({
                  controller: DialogBusinessController,
                  templateUrl: '/app/src/managePanel/view/CreateBusiness.html',
                  css: '/app/src/managePanel/css/createBusiness.css',
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
                      'description': $scope.description,
                      'buffer_time': $scope.bufftime
                  };
                  ManagePanelService.createBusiness(data_msg)
                      .then(function (result) {
                          alert(result);
                          $mdDialog.cancel();
                      })
                      .catch(function(err){
                          alert(err);
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
                      $scope.bufftime = business['buffer_time'];
                      // $scope.select_check();
                  })
                  .catch(function(err){
                      alert(err);
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
                      'business_id': id,
                      'buffer_time': $scope.bufftime
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
                    })
                    .catch(function(err){
                        alert(err);
                    });
              }
          }

  //业务相关
          $scope.AssociateBusiness = function (business_id) {
              $state.go('manageAssociate',{b_id:business_id});
          };

          function updateBusinesses() {
              ManagePanelService
                  .loadAllBusinesses()
                  .then(function(business){
                      $scope.Businesses = [].concat(business);
                  })
                  .catch(function(err){
                      alert(err);
                  });
          }

      }

  //业务相关信息
          function AssociateBusinessController($scope, ManagePanelService, $state, $stateParams, $sessionStorage, $q, $timeout) {
              var id = $stateParams.b_id || $sessionStorage.b_id;
              $sessionStorage.b_id = id
    //服务器信息
              $scope.openMenu = function($mdOpenMenu, ev) {
                  $mdOpenMenu(ev);
              };
              updateServers();
              $scope.items = [];
              $scope.is_delete = false;
              $scope.is_add = false;

              $scope.back = function(){
                  $state.go('managePanel');
              }

              $scope.addServer = function(){
                  $scope.is_add = true;
                  $scope.P_ips = [];
                  ManagePanelService
                      .getPoolIps(id)
                      .then(function(res){
                          if(res.length>0){
                              res.forEach(function(item, index, array){
                                  $scope.P_ips.push({
                                      id: index,
                                      ip: item['ip'],
                                      port: item['port'],
                                      pool_id: item['pool_id']
                                  });
                              });
                          }
                      })
                      .catch(function(err){
                          alert(err);
                      });

              }
              $scope.selectIp = function(index){
                  $scope.proPort = $scope.P_ips[index]['port']
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
                      if(!reg.test($scope.ip)&&$scope.type!=1){
                          alert('IP格式不正确！');
                          return;
                      }
                      if(($scope.get_ip===""||$scope.get_ip===undefined)&&$scope.type==1){
                          alert('请选择IP！');
                          return;
                      }
                      if(($scope.port==""||$scope.port==undefined)&&$scope.type!=1){
                          alert('服务器端口号不能为空！');
                          return;
                      }
                      var data = {
                          'server_name': $scope.name,
                          'server_ip': $scope.type != 1 ? $scope.ip : $scope.P_ips[$scope.get_ip]['ip'],
                          'server_port': $scope.type !=1 ? $scope.port : $scope.P_ips[$scope.get_ip]['port'],
                          'server_type': types[$scope.type],
                          'business_id': id,
                          'pool_id': $scope.type != 1 ? null : $scope.P_ips[$scope.get_ip]['pool_id']
                      }
                      ManagePanelService
                          .postAssociateServer(data)
                          .then(function(result){
                              alert(result);
                              $scope.is_add = false;
                              emptyServerVal();
                              updateServers();
                          })
                          .catch(function(err){
                              alert(err);
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
                                    alert(res);
                                    $scope.is_delete = false;
                                    $scope.selected = [];
                                    updateServers();
                                })
                                .catch(function(err){
                                    alert(err);
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
                      })
                      .catch(function(err){
                          alert(err);
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
              var deptMaps = {};
              var departments = [];
              var personsInDept = [];
              var perDeptMap = {};
              $scope.searchDept = null;
              $scope.searchPerson = null;

              emptyPersonVal();
              updatePersons();

              $scope.delete_per = false;
              $scope.add_per = false;
              $scope.addPerson = function(){
                  $scope.add_per = true;
                  $scope.loadedDept = false;
                  ManagePanelService
                      .getAssociateDepartments()
                      .then(function(res){
                          for(var i=0;i<res.length;i++){
                            departments.push(res[i].departmentName);
                            deptMaps[res[i].departmentName] = res[i].departmentId;
                          }
                          $scope.DeptStates = load(departments);
                          $scope.loadedDept = true;
                      })
                      .catch(function(err){
                          alert(err);
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

              $scope.selectDept = function(){
                  $scope.loadedPer = false;
                  personsInDept = [];
                  if(departments.indexOf($scope.searchDept)>-1){
                      var dept = deptMaps[$scope.searchDept];
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
                                  personsInDept.push(u_name);
                                  perDeptMap[u_name] = res[i]['userId'];
                                }
                              }
                              $scope.PersonStates = load(personsInDept);
                              $scope.loadedPer = true;
                          })
                          .catch(function(err){
                              alert(err);
                          });
                  }
              }
              var id_for_name = {};
              $scope.selectPersonDept = function(){
                  var name = $scope.searchPerson;
                  var user_id = perDeptMap[name];
                  var dept = $scope.searchDept;
                  var selected = name + '[' + dept + ']';
                  if($scope.selected_persons.indexOf(selected)<=-1&&personsInDept.indexOf(name)>-1){
                      $scope.selected_persons.push(selected);
                      id_for_name[name] = user_id;
                  }
              }
              $scope.subPersons = function(){
        //添加人员
                  if($scope.add_per){
                      var select = [];
                      var persons = $scope.selected_persons;
                      for(var i in persons){
                          var name = persons[i].slice(0,persons[i].indexOf('['))
                          select.push(id_for_name[name]);
                      }
                      if(select.length>0){
                          var data = {
                              businessId:id,
                              userIds:JSON.stringify(select)
                          }
                          ManagePanelService
                              .postAssociatePersons(data)
                              .then(function(res){
                                  alert(res);
                                  $scope.add_per = false;
                                  emptyPersonVal();
                                  updatePersons();
                              })
                              .catch(function(err){
                                  alert(err);
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
                                  alert(res);
                                  emptyPersonVal();
                                  updatePersons();
                              })
                              .catch(function(err){
                                  alert(err);
                              });
                          }
                      }
                  }
              }

              //人员查询相关
              $scope.querySearch  = querySearch;
              function load(item) {
                  return item.map(function(state){
                    return {
                      value: state.toLowerCase(),
                      display: state
                    };
                  });
              }

              function querySearch(query, state) {
                  var results;
                  if(query=='all')
                      results = state;
                  else
                      results = query ? state.filter( createFilterFor(query) ) : state;
                  var deferred = $q.defer();
                  $timeout(function () { deferred.resolve( results ); }, Math.random() * 500, false);
                  return deferred.promise;
              }

              function createFilterFor(query) {
                  var lowercaseQuery = angular.lowercase(query);

                  return function filterFn(state) {
                    return (state.value.indexOf(lowercaseQuery) === 0);
                  };

              }

              function updatePersons(){
                  $scope.selectedPerson = [];
                  $scope.loaded3 = false;
                  ManagePanelService
                      .getAssociatePersons(id)
                      .then(function(res){
                          $scope.PersonsInfo = res;
                          for(var i in res){
                              $scope.Persons.push(res[i]['user_name']);
                          }
                          $scope.loaded3 = true;
                      })
                      .catch(function(err){
                          alert(err);
                      });
              }
              function emptyPersonVal(){
                  $scope.PersonsInfo = [];//人员列表显示
                  $scope.Persons = [];//所有人员 id
                  personsInDept = [];
                  $scope.selected_persons = [];//选中的人员
                  departments = [];
                  deptMaps = {};
                  personsInDept = [];
                  perDeptMap = {};
                  $scope.selectedDept = 0;
              }
    //负载均衡信息
              updatePool();
              $scope.addLB = function(){
                  $scope.add_pool = true;
                  ManagePanelService
                      .getPools()
                      .then(function(res){
                          $scope.Pools = [].concat(res);
                      })
                      .catch(function(err){
                          alert(err);
                      });
              }
              $scope.delLB = function(lb_id){
                  if(confirm('是否要删除？')){
                    ManagePanelService
                        .deletePool(lb_id)
                        .then(function(res){
                            alert(res)
                            updatePool();
                        })
                        .catch(function(err){
                            alert(err);
                        });
                  }
              }
              $scope.cancelAdd = function(){
                  $scope.add_pool = false;
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
                      })
                      .catch(function(err){
                          alert(err);
                      });
              }
              function updatePool(){
                  $scope.add_pool = false;
                  $scope.loaded5 = false;
                  ManagePanelService
                      .getPool(id)
                      .then(function(res){
                          if(res.length>0){
                            $scope.PoolMsgs = res;
                          }else{
                            $scope.PoolMsgs = [];
                          }
                          $scope.loaded5 = true;
                      })
                      .catch(function(err){
                          alert(err);
                      });
              }

    //历史版本
            ManagePanelService
                .getHistoryVersion(id)
                .then(function(result){
                    var len = result.length;
                    var versions = [];
                    for(var i=0;i<len;i++){
                        versions.push({
                          value:i,
                          legend:result[i]
                        });
                    }
                    $scope.slider = {
                        value: len - 1,
                        options: {
                          floor: 0,
                          ceil: len-1,
                          vertical: true,
                          showSelectionBar: true,
                          showTicksValues: true,
                          stepsArray: versions
                        }
                    };
                })
                .catch(function(err){
                    alert(err);
                });
          }


        return {
            ManagePanelController: ManagePanelController,
            AssociateBusinessController: AssociateBusinessController
        }
    }
);

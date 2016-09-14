define([],
    function(){
        function ResourcePanelController($scope, $mdDialog, ResourcePanelService, $state){
            updateLBlist();
            $scope.openMenu = function($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };
            var id;
    //添加LB
           var types = ['lb_f5','lb_ad'];
           $scope.addLB = function(ev){
              $mdDialog.show({
                controller:AddLBController,
                templateUrl:'/app/src/resourcePanel/view/CreateLB.html',
                parent: angular.element(document.getElementById('content')),
                targetEvent: ev,
                clickOutsideToClose: true
              });
           }
           function AddLBController($scope, $mdDialog){
               $scope.cancel = function () {
                   $mdDialog.cancel();
               };

               $scope.is_ip = false;
               $scope.submitCreate = function(){
                  var reg = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
                  var IP = $scope.ip;
                  if(!reg.test($scope.ip)){
                      $scope.is_ip = true;
                      return;
                  }
                  else{
                      $scope.is_ip = false;
                  }
                  var data = {
                      lb_type:types[$scope.check_type],
                      description:$scope.description,
                      port:$scope.port,
                      password:$scope.password,
                      user_name:$scope.name,
                      lb_ip:$scope.ip
                  }
                  ResourcePanelService
                      .postLB(data)
                      .then(function(res){
                          alert(res);
                          $scope.cancel();
                          updateLBlist();
                      });
               }
           }

    //删除LB
           $scope.deleteLB = function(id){
               if(confirm('是否要删除？')){
                 ResourcePanelService
                    .deleteLB(id)
                    .then(function(res){
                        alert(res);
                        updateLBlist();
                    });
               }
           }

    //修改LB
          $scope.modifyLB = function(lb_id){
              id = lb_id;
              $mdDialog.show({
                controller:ModifyLBController,
                templateUrl:'/app/src/resourcePanel/view/ModifyLB.html',
                parent: angular.element(document.getElementById('content')),
                clickOutsideToClose: true
              });
          }
          function ModifyLBController($scope,$mdDialog){
              $scope.cancel = function () {
                  $mdDialog.cancel();
              };
              $scope.loaded = false;
              ResourcePanelService
                  .getLB(id)
                  .then(function(res){
                      $scope.check_type = types.indexOf(res['lb_type']);
                      $scope.ip = res['lb_ip'];
                      $scope.port = parseInt(res['port']);
                      $scope.name = res['user_name'];
                      $scope.password = '';
                      $scope.description = res['description'];
                      $scope.loaded = true;
                  });

              $scope.submitModify = function(){
                  var data = {
                      lb_type:types[$scope.check_type],
                      description:$scope.description,
                      port:$scope.port,
                      password:$scope.password,
                      user_name:$scope.name,
                      lb_ip:$scope.ip,
                      lb_id:id
                  }
                  ResourcePanelService
                      .modifyLB(data)
                      .then(function(res){
                          alert(JSON.stringify(res));
                          $scope.cancel();
                          updateLBlist();
                      });
              }
          }

    //LB池管理
           $scope.LBcenter = function(lb_id){
               $state.go('lbcenter', {_id:lb_id});
           }


           function updateLBlist(){
               $scope.loaded = false;
               $scope.LBlist = [];
               ResourcePanelService
                   .getLBlist()
                   .then(function(res){
                       $scope.LBs = [].concat(res);
                       $scope.loaded = true;
                   });
           }
        }

    //LBCenter
        function LBcenterController($scope, ResourcePanelService, $state, $stateParams, $sessionStorage){
            var id = $stateParams._id || $sessionStorage.lb_id;
            $sessionStorage.lb_id = id;

            $scope.back = function(){
                $state.go('resourcePanel');
            }
            $scope.openMenu = function($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

             updatePoollist();

             $scope.add_pool = false;
             $scope.del_pool = false;
             $scope.deletePool = function(){
                 $scope.del_pool = true;
                 $scope.show_ip = false;
             }
             $scope.cancelPool = function(){
                 $scope.del_pool = false;
                 $scope.add_pool = false;
             }
             $scope.addPool = function(){
                 $scope.add_pool = true;
                 $scope.pool_name = "";
                 $scope.description = "";
                 $scope.show_ip = false;
             }

            //处理复选框

            $scope.selectedPools = [];
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
                return $scope.selectedPools.length === $scope.poolNames.length;
            };
            $scope.toggleAll = function() {
                if ($scope.selectedPools.length === $scope.poolNames.length) {
                    $scope.selectedPools = [];
                } else if ($scope.selectedPools.length === 0 || $scope.selectedPools.length > 0) {
                    $scope.selectedPools = $scope.poolNames.slice(0);
                }
            };

       //池内ip管理
            $scope.show_ip = false;
            $scope.IPs = [];
            $scope.toggleIp = function(pool_id){
               if($scope.show_ip){
                   $scope.show_ip = false;
                   $scope.IPs = [];
               }
               else{
                   $scope.show_ip = true;
                   ResourcePanelService
                      .getIps(pool_id)
                      .then(function(res){
                         for(var i in res){
                             $scope.IPs.push({
                               ip: i,
                               status: res[i]=='STATE_ENABLED'?true:false
                             });
                         }
                      });
               }
            }
            $scope.submitState = function(p_id,ips,status){
               var ip = ips.slice(0,ips.indexOf(':'));
               var port = ips.slice(ips.indexOf(':')+1);
               var sts = '';
               if(status){
                 sts = 'STATE_ENABLED';
               }
               else{
                 sts = 'STATE_DISABLED';
               }
               var data = {
                   pool_id:p_id,
                   server_ip:ip,
                   server_port:port,
                   status:sts
               }
               ResourcePanelService
                   .postIpState(data)
                   .then(function(res){
                       alert(res);
                       $scope.IPs = [];
                       ResourcePanelService
                          .getIps(p_id)
                          .then(function(res){
                             for(var i in res){
                                 $scope.IPs.push({
                                   ip: i,
                                   status: res[i]=='STATE_ENABLED'?true:false
                                 });
                             }
                          });
                   })
            }

            $scope.is_empty = false;
            $scope.submitPool = function(){
       //添加池
              if($scope.add_pool){
                 if(!$scope.pool_name){
                     $scope.is_empty = true;
                     return;
                 }
                 else{
                     var data = {
                         pool_name:$scope.pool_name,
                         description:$scope.description,
                         lb_id:id
                     }
                     $scope.is_empty = false;
                     ResourcePanelService
                         .postPool(data)
                         .then(function(res){
                             alert(res);
                             $scope.add_pool = false;
                             updatePoollist();
                         });
                 }
              }
       //删除池
              else{
                 if($scope.selectedPools.length>0){
                     if(confirm('是否要删除？')){
                         var data = {
                             pools:JSON.stringify($scope.selectedPools),
                             lb_id:id
                         }
                         ResourcePanelService
                             .deletePools(data)
                             .then(function(res){
                                 if(typeof res == 'string'){
                                     alert(res);
                                 }
                                 else{
                                     var msg = '错误信息：\n';
                                     for(var i in res){
                                       msg += res[i]['pool_name'] + ':' + res[i]['message'] + '\n';
                                     }
                                     alert(msg);
                                 }
                             });
                         updatePoollist();
                         $scope.selectedPools = [];
                     }

                 }
              }
            }

            function updatePoollist(){
                $scope.poolNames = [];
                $scope.loaded = false;
                ResourcePanelService
                    .getLBPools(id)
                    .then(function(res){
                       $scope.Pools = [].concat(res);
                       for(var i in res){
                           $scope.poolNames.push(res[i]['pool_name']);
                       }
                       $scope.loaded = true;
                    });
            }
        }
        return {
            ResourcePanelController: ResourcePanelController,
            LBcenterController: LBcenterController
        }
    }
);

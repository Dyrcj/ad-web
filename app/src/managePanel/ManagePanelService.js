(function(){
    'use strict';
    angular.module('managePanel')
        .service('ManagePanelService', ['$q', '$http', 'ENV', ManagePanelService]);


    function ManagePanelService($q, $http, ENV){
        var ad_config = {
          ip: ENV.main_server.ip,
          port: ENV.main_server.port
        }
//获取业务列表
        function getBusiness() {
          console.log('.........'+JSON.stringify(ENV.main_server));
            var defer = $q.defer();
            $http.get(
                'http://' + ad_config.ip + ':' + ad_config.port + '/business'
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//获取特定业务
        function getABusiness(business_id) {
            var defer = $q.defer();
            $http.get(
                'http://' + ad_config.ip + ':' + ad_config.port + '/business/businessInfo/' + business_id
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch (function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//删除特定业务
        function deleteABusiness(business_id){
            var defer = $q.defer();
            $http.delete(
                'http://' + ad_config.ip + ':' + ad_config.port + '/business/' + business_id
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//修改特定业务
        function modifyABusiness(data){
            var defer = $q.defer();
            $http.post(
                'http://' + ad_config.ip + ':' + ad_config.port + '/business/edit',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//新建业务
        function postBusiness(data) {
            var defer = $q.defer();
            $http.post(
                'http://' + ad_config.ip + ':' + ad_config.port + '/business/add',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//获取关联服务器列表
        function getAServers(business_id){
            var defer = $q.defer();
            $http.get(
                'http://' + ad_config.ip + ':' + ad_config.port + '/business/serverInfo/' + business_id
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch (function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//增加关联服务器
        function postAServer(data){
            console.log(JSON.stringify(data));
            var defer = $q.defer();
            $http.post(
                'http://' + ad_config.ip + ':' + ad_config.port + '/business/server',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//删除关联服务器
        function deleteAServer(data){
            var defer = $q.defer();
            $http.post(
                'http://' + ad_config.ip + ':' + ad_config.port + '/business/deleteServer',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//获取关联人员列表
        function getAPersons(id){
            var defer = $q.defer();
            $http.get(
                'http://' + ad_config.ip + ':' + ad_config.port + '/business/getUsers/' + id
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch (function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//获取部门列表
         function getADepartment(){
             var defer = $q.defer();
            //  $http.get(
            //      'http://' + ad_config.ip + ':' + ad_config.port + '/user/department'
            //  ).then(function (result) {
            //      defer.$$resolve(result['data']['message']);
            //  }).catch (function (err) {
            //      defer.$$reject(err);
            //  });
            //  return defer.promise;
            //  var defer = $q.defer();
            //  var Proxy = require('hessian-proxy').Proxy;
            //  var proxy = new Proxy('http://10.151.30.80:18003/employee-hessian/soaRest/UserFacade/queryAllDepartments');
            //  proxy.invoke([], function (err, reply){
             //
            //  });


            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            //delete $http.defaults.headers.common['X-Requested-With'];
            //delete $http.defaults.headers;
             $http.post(
                'http://10.151.30.80:18003/employee-hessian/soaRest/UserFacade/queryAllDepartments',
                $.param('[]')
            ).then(function (result) {
                defer.$$resolve(result['data']);
                console.log(JSON.stringify(result));
            }).catch(function (err) {
                defer.$$reject(err);
            });


            return defer.promise;
         }
//获取某部门下的所有人员
         function getPersonsInDept(dept){
             var defer = $q.defer();
             $http.get(
                 'http://' + ad_config.ip + ':' + ad_config.port + '/user/getUsersByDepartment/' + dept
             ).then(function (result) {
                 defer.$$resolve(result['data']['message']);
                //  console.log(JSON.stringify(result['data']['message']));
             }).catch (function (err) {
                 defer.$$reject(err);
             });
             return defer.promise;
         }
//为业务添加人员
        function postAPersons(data){
            var defer = $q.defer();
            $http.post(
                'http://' + ad_config.ip + ':' + ad_config.port + '/business/addUsers',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
                // console.log(JSON.stringify(result['data']['message']));
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//删除业务中选中人员
        function deleteAPersons(data){
            var defer = $q.defer();
            $http.post(
                'http://' + ad_config.ip + ':' + ad_config.port + '/business/deleteUsers',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
                // console.log(JSON.stringify(result['data']['message']));
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//获取负载均衡池
        function getLBPool(business_id){
            var defer = $q.defer();
            $http.get(
                'http://' + ad_config.ip + ':' + ad_config.port + '/business/poolInfo/' + business_id
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch (function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

//获取所有池
        function getLBPools(){
            var defer = $q.defer();
            $http.get(
                'http://' + ad_config.ip + ':' + ad_config.port + '/f5/pool/getPools/index'
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch (function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//为业务添加池
        function postLBPool(data){
            var defer = $q.defer();
            $http.post(
                'http://' + ad_config.ip + ':' + ad_config.port + '/business/lbPool',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//删除已为业务分配的池
        function deleteLBPool(id){
            var defer = $q.defer();
            $http.delete(
                'http://' + ad_config.ip + ':' + ad_config.port + '/business/lbPool/' + id
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

        return {
            loadAllBusinesses: function () {
                return getBusiness();
            },
            createBusiness: function (data) {
                return postBusiness(data);
            },
            getTheBusiness:function(id){
                return getABusiness(id);
            },
            modifyTheBusiness:function(data){
                return modifyABusiness(data);
            },
            deleteTheBusiness:function(id){
                return deleteABusiness(id);
            },
            getAssociateServers:function(id){
                return getAServers(id);
            },
            postAssociateServer:function(data){
                return postAServer(data);
            },
            deleteAssociateServer:function(data){
                return deleteAServer(data);
            },
            getAssociatePersons:function(id){
                return getAPersons(id);
            },
            getAssociateDepartments:function(){
                return getADepartment();
            },
            getAssociatePersonsInDept:function(dept){
                return getPersonsInDept(dept);
            },
            postAssociatePersons:function(data){
                return postAPersons(data);
            },
            deleteAssociatePersons:function(data){
                return deleteAPersons(data);
            },
            getPool:function(id){
                return getLBPool(id);
            },
            getPools:function(){
                return getLBPools();
            },
            postPool:function(data){
                return postLBPool(data);
            },
            deletePool:function(id){
                return deleteLBPool(id);
            }
        };
    }
})();

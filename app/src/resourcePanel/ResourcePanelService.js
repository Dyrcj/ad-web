(function(){
    'use strict';
    angular.module('resourcePanel')
        .service('ResourcePanelService',['$q','$http','ENV',ResourcePanelService]);


    function ResourcePanelService($q, $http, ENV){
        var ad_config = {
          ip: ENV.main_server.ip,
          port: ENV.main_server.port
        }
//获取负载均衡列表
        function getLBs(){
            var defer = $q.defer();
            $http.get(
                'http://' + ad_config.ip + ':' + ad_config.port + '/f5'
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

//获取负载均衡
        function getALB(id){
            var defer = $q.defer();
            $http.get(
                'http://' + ad_config.ip + ':' + ad_config.port + '/f5/' + id
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

//添加负载均衡
        function postALB(data){
            var defer = $q.defer();
            $http.post(
                'http://' + ad_config.ip + ':' + ad_config.port + '/f5/add',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

//删除负载均衡
        function deleteALB(id){
            var defer = $q.defer();
            $http.delete(
                'http://' + ad_config.ip + ':' + ad_config.port + '/f5/'+id
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//修改负载均衡
        function modifyALB(data){
            var defer = $q.defer();
            $http.post(
                'http://' + ad_config.ip + ':' + ad_config.port + '/f5/edit',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

//获取池列表
        function getPools(id){
            var defer = $q.defer();
            $http.get(
                'http://' + ad_config.ip + ':' + ad_config.port + '/f5/pools/' + id
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

//添加池
        function postAPool(data){
            var defer = $q.defer();
            $http.post(
                'http://' + ad_config.ip + ':' + ad_config.port + '/f5/pool/add',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

//删除池
        function deleteAPools(data){
            var defer = $q.defer();
            $http.post(
                'http://' + ad_config.ip + ':' + ad_config.port + '/f5/pool/delete',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

//获取池内IP列表
        function getPoolIps(id){
            var defer = $q.defer();
            $http.get(
                'http://' + ad_config.ip + ':' + ad_config.port + '/f5/pools/' + id
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

//提交IP状态的修改信息
        function postPoolIp(data){
            var defer = $q.defer();
            $http.post(
                'http://' + ad_config.ip + ':' + ad_config.port + '/f5/pool/delete',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }

        return {
            getLBlist:function(){
                return getLBs();
            },
            getLB:function(id){
                return getALB(id)
            },
            postLB:function(data){
                return postALB(data);
            },
            deleteLB:function(id){
                return deleteALB(id);
            },
            modifyLB:function(data){
                return modifyALB(data);
            },
            getLBPools:function(id){
                return getPools(id);
            },
            postPool:function(data){
                return postAPool(data);
            },
            deletePools:function(data){
                return deleteAPools(data);
            },
            getIps:function(id){
                return getPoolIps(id);
            },
            postIpState:function(data){
                return postPoolIp(data);
            }
        };
    }
})();

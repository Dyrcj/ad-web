(function(){
    'use strict';
    angular.module('managePanel')
        .service('ManagePanelService', ['$q', '$http', ManagePanelService]);

    function ManagePanelService($q, $http){
//获取业务列表
        function getBusiness() {
            var defer = $q.defer();
            $http.get(
                'http://172.17.106.21:4200/business'
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
                'http://172.17.106.21:4200/business/' + business_id
            ).then(function (result) {
                defer.$$resolve(result['data']['message']['businessInfo']);
            }).catch (function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//删除特定业务
        function deleteABusiness(business_id){
            var defer = $q.defer();
            $http.delete(
                'http://172.17.106.21:4200/business/' + business_id
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
                'http://172.17.106.21:4200/business/edit',
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
                'http://172.17.106.21:4200/business/add',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//获取业务列表
        function getAServers(business_id){
            var defer = $q.defer();
            $http.get(
                'http://172.17.106.21:4200/business/' + business_id
            ).then(function (result) {
                defer.$$resolve(result['data']['message']['servers']);
                // console.log(result['data']['message']['servers'].toString())
            }).catch (function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//增加关联服务器
        function postAServer(data){
            var defer = $q.defer();
            $http.post(
                'http://172.17.106.21:4200/business/server',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
                console.log(JSON.stringify(result));
            }).catch(function (err) {
                defer.$$reject(err);
            });
            return defer.promise;
        }
//删除关联服务器
        function deleteAServer(data){
            console.log(JSON.stringify(data));
            var defer = $q.defer();
            $http.post(
                'http://172.17.106.21:4200/business/deleteServer',
                $.param(data)
            ).then(function (result) {
                defer.$$resolve(result['data']['message']);
                console.log(JSON.stringify(result));
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
            }
        };
    }
})();
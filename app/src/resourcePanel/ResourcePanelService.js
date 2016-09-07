(function(){
    'use strict';
    angular.module('resourcePanel')
        .service('ResourcePanelService',['$q','$http','ENV','AppService', ResourcePanelService]);


    function ResourcePanelService($q, $http, ENV, AppService){
        var ad_config = {
          ip: ENV.main_server.ip,
          port: ENV.main_server.port
        }

//获取负载均衡列表
        this.getLBlist = function(){
            var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/f5';
            return AppService.get(url);
        }

//获取负载均衡
        this.getLB = function(id){
            var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/f5/' + id;
            return AppService.get(url);
        }
//添加负载均衡
        this.postLB = function(data){
            var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/f5/add';
            return AppService.post(url, data);
        }

//删除负载均衡
        this.deleteLB = function(id){
            var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/f5/'+id;
            return AppService.delete(url);
        }
//修改负载均衡
        this.modifyLB = function(data){
            var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/f5/edit';
            return AppService.post(url, data);
        }

//获取池列表
        this.getLBPools = function(id){
            var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/f5/pools/' + id;
            return AppService.get(url);
        }

//添加池
        this.postPool = function(data){
            var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/f5/pool/add';
            return AppService.post(url, data);
        }

//删除池
        this.deletePools = function(data){
            var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/f5/pool/delete';
            return AppService.post(url, data);
        }

//获取池内IP列表
        this.getIps = function(id){
            var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/f5/pool/getPoolServerStatus/' + id;
            return AppService.get(url);
        }

//提交IP状态的修改信息
        this.postIpState = function(data){
            var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/f5/pool/setServerStatus';
            return AppService.post(url, data);
        }

    }
})();

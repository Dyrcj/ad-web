define([],
     function(){
       function ManagePanelService($q, $http, ENV, AppService){
           var ad_config = {
             ip: ENV.main_server.ip,
             port: ENV.main_server.port
           }

   //获取业务列表
           this.loadAllBusinesses = function(){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business';
               return AppService.get(url);
           }

   //获取特定业务
           this.getTheBusiness = function(business_id){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/businessInfo/' + business_id;
               return AppService.get(url);
           }

   //删除特定业务
           this.deleteTheBusiness = function(business_id){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/' + business_id;
               return AppService.delete(url);
           }

   //修改特定业务
           this.modifyTheBusiness = function(data){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/edit';
               return AppService.post(url, data);
           }

   //新建业务
           this.createBusiness = function(data){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/add';
               return AppService.post(url, data);
           }

   //获取关联服务器列表
           this.getAssociateServers = function(business_id){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/serverInfo/' + business_id;
               return AppService.get(url);
           }

   //增加关联服务器
           this.postAssociateServer = function(data){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/server';
               return AppService.post(url, data);
           }

   //删除关联服务器
           this.deleteAssociateServer = function(data){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/deleteServer';
               return AppService.post(url, data);
           }

   //获取关联人员列表
           this.getAssociatePersons = function(id){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/getUsers/' + id;
               return AppService.get(url);
           }

   //获取部门列表
            this.getAssociateDepartments = function(){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/user/department';
                return AppService.get(url);
            }

   //获取某部门下的所有人员
            this.getAssociatePersonsInDept = function(dept){
                var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/user/getUsersByDepartment/' + dept;
                return AppService.get(url);
            }

   //为业务添加人员
           this.postAssociatePersons = function(data){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/addUsers';
               return AppService.post(url, data);
           }

   //删除业务中选中人员
           this.deleteAssociatePersons = function(data){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/deleteUsers';
               return AppService.post(url, data);
           }

   //获取负载均衡池
           this.getPool = function(business_id){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/poolInfo/' + business_id;
               return AppService.get(url);
           }

   //获取所有池
           this.getPools = function(){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/f5/pool/getPools/index';
               return AppService.get(url);
           }

   //为业务添加池
           this.postPool = function(data){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/lbPool';
               return AppService.post(url, data);
           }

   //删除已为业务分配的池
           this.deletePool = function(id){
               var url = 'http://' + ad_config.ip + ':' + ad_config.port + '/business/lbPool/' + id;
               return AppService.delete(url);
           }
       }

          return {
              ManagePanelService: ManagePanelService
          }
     }
)

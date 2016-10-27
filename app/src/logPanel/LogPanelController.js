define([],
    function(){
        function LogController($scope, $q, $timeout, logService, $state){

            $scope.selectedBusiness = null;
            $scope.selectedPerson = null;
            $scope.searchBusiness = null;
            $scope.searchPerson = null;
            $scope.querySearch  = querySearch;

            $scope.startTime = new Date();
            $scope.endTimeStart = new Date($scope.startTime.getTime() + 24 * 3600 * 1000 );
            $scope.endTime =  new Date((new Date()).getTime() + 24 * 3600 * 1000 );
            $scope.updateEnd = function() {
                if($scope.endTime <= $scope.startTime )
                    $scope.endTime = new Date($scope.startTime.getTime() + 24 * 3600 * 1000 );
                $scope.endTimeStart = new Date($scope.startTime.getTime() + 24 * 3600 * 1000 );
            }
            $scope.Logs = [];
            $scope.loaded = false;

            var businessKey = {};
            var businessVal = {};
            var userKey = {};

            logService
                .getAllBusinessUsers()
                .then(function(res){
                    var businesses = res['businesses'];
                    var business = [];
                    for(var i in businesses){
                        business.push(businesses[i]['name']);
                        businessKey[businesses[i]['name']] = businesses[i]['_id'];
                        businessVal[businesses[i]['_id']] = businesses[i]['name'];
                    }
                    var users = res['users'];
                    var user = [];
                    for(var i in users){
                        user.push(users[i]['user_name']);
                        userKey[users[i]['user_name']] = users[i]['user_id'];
                    }
                    $scope.BusinessStates = load(business);
                    $scope.PersonStates = load(user);
                    $scope.loaded = true;
                })
                .catch(function(err){
                    alert(err);
                });

    //查询日志
            $scope.search = function() {
                $scope.Logs = [];
                var business_id = businessKey[$scope.searchBusiness];
                var user_id = userKey[$scope.searchPerson];
                var start = $scope.startTime.toLocaleDateString().split('/').join('-');
                var end = $scope.endTime.toLocaleDateString().split('/').join('-');
                var data = {
                    user_id: user_id,
                    business_id: business_id,
                    start_time: start,
                    end_time: end
                }
                if(($scope.searchBusiness==null||$scope.searchBusiness=="")&&($scope.searchPerson==null||$scope.searchPerson=="")) {
                    alert('业务名称和操作人员不能都为空！')

                }else{
                    logService
                        .getAllLogs(data)
                        .then(function(res){
                            for(var i in res){
                                $scope.Logs.push({
                                    date: timeInLog(res[i]['operations_id']),
                                    user: res[i]['user_id'],
                                    business: businessVal[res[i]['business_id']],
                                    operations: res[i]['operations']
                                });
                            }
                        })
                        .catch(function(err){
                            alert(err);
                        });
                }
            }

    //获取
            function load(item) {
                return item.map(function(state){
                  return {
                    value: state.toLowerCase(),
                    display: state
                  };
                });
            }

            function querySearch (query, state) {
                var results = query ? state.filter( createFilterFor(query) ) : state;
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
        }

//从日志id中获取时间
        function timeInLog(s) {
            var s = s.slice(-14).split('-');
            s[0] = '20' + s[0];
            var date = s.slice(0, 3).join('-');
            var time = s.slice(3).join(':');
            return date + ' ' + time;
        }

        return {
            LogController: LogController
        }
    }
);

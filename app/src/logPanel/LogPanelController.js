define([],
    function(){
        function LogController($scope, $q, $timeout, logService, $state){

            $scope.BusinessStates = loadBusiness();
            $scope.PersonStates = loadPersons();
            $scope.selectedBusiness = null;
            $scope.selectedPerson = null;
            $scope.searchBusiness = null;
            $scope.searchPerson = null;
            $scope.querySearch  = querySearch;

    //获取所有业务
            function loadBusiness() {
                var businesses = ['Alabama','Arkansas','Connecticut','Illinois','Kentucky','Virginia','Virginia']
                return businesses.map(function(state){
                  return {
                    value: state.toLowerCase(),
                    display: state
                  };
                });
            }

    //获取所有人员
            function loadPersons() {
                var persons = ['Aama','Arnsas','Connect','Illin','lucky','Vginia','Vinia']
                return persons.map(function(state){
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

            $scope.openDetails = function(){
                $state.go('logDetails');
            }
        }

        function LogDetailsController($scope, logService, $state, $stateParams){
            $scope.back = function(){
                $state.go('logPanel');
            }
        }
        return {
            LogController: LogController,
            LogDetailsController: LogDetailsController
        }
    }
);

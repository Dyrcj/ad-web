define([], 
    function(){
        function personController($scope,personService,$mdDialog,$state){

            $scope.loaded = false;
            $scope.personList = [];

            personService
                .queryAllPerson()
                .then(function (personList) {
                    $scope.personList = [].concat(personList);
                    $scope.loaded = true;
                });

            /**
             * 为用户添加业务
             * @param ev
             */
            $scope.showAdd = function (ev,userId) {
                $state.go('forbusiness', {u_id:userId});
            };
        }

        function addBussinessForPersonCtrl($scope, personService, $state, $stateParams, $sessionStorage) {
            var userId = $stateParams.u_id || $sessionStorage.u_id;
            $sessionStorage.u_id = userId;
            $scope.loaded = false;
            $scope.businessList = [];
            $scope.noAuthBusinessList = [];

            $scope.back = function(){
                $state.go('person');
            }

            personService
                .queryBussinessByUser(userId)
                .then(function (data) {
                    $scope.businessList = [].concat(data["authorizedBusinesses"]);
                    $scope.noAuthBusinessList = [].concat(data["unauthorizedBusinesses"]);
                    $scope.loaded = true;
                });


            $scope.openMenu = function($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };
            $scope.doAddBusinessForUser = function(){
                alert(JSON.stringify($scope.noAuthBusinessList));
                $mdDialog.hide();
            };
        };
        return {
            personController: personController,
            addBussinessForPersonCtrl: addBussinessForPersonCtrl
        }
    }
);

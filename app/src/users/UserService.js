(function(){
  'use strict';

  angular.module('users')
         .service('userService', ['$q', '$http', UserService]);

  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function UserService($q, $http){

      var signin = "http://172.17.106.21:4200/user/signin";

      function postLogin(data) {
          var defer = $q.defer();
          $http.post(
              signin,
              $.param(data)
          ).then(function (result) {
              console.log(result['data']['success']);
              if(result['data']['success']) {
                  defer.$$resolve(result['data']['token']);
              } else {
                  defer.$$reject(result['data']['message']);
              }
          }).catch(function (err) {
              defer.$$reject(err);
          });
          return defer.promise;
      }

    // Promise-based API
    return {
      userLogin: function (data) {
          return postLogin(data);
      }
    };
  }

})();

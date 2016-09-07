angular
    .module('starterApp')
    .service('AppService',['$q', '$http', AppService]);

function AppService($q,$http){

    this.get = function(url){
        var defer = $q.defer();
        $http.get(
            url
        ).then(function (result) {
            defer.$$resolve(result['data']['message']);
        }).catch (function (err) {
            defer.$$reject(err);
        });
        return defer.promise;
    }

    this.post = function(url, data){
        var defer = $q.defer();
        $http.post(
            url,
            $.param(data)
        ).then(function (result) {
            defer.$$resolve(result['data']['message']);
        }).catch(function (err) {
            defer.$$reject(err);
        });
        return defer.promise;
    }

    this.delete = function(url){
        var defer = $q.defer();
        $http.delete(
            url
        ).then(function (result) {
            defer.$$resolve(result['data']['message']);
        }).catch(function (err) {
            defer.$$reject(err);
        });
        return defer.promise;
    }

}

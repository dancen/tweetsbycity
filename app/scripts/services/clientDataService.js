/**
 * Description of mainService.js
 *
 * @author daniele centamore
 * @email "daniele.centamore@gmail.com"
 */

(function () {




// MODULE TO MANAGE SERVICES
    var clientDataService = angular.module('clientDataService', []);



    /**
     * ClientDataService() 
     * rest web service to get data info
     * about the client such as
     * 
     *  "ip": "8.8.8.8",
     *  "hostname": "google-public-dns-a.google.com",
     *  "loc": "37.385999999999996,-122.0838",
     *  "org": "AS15169 Google Inc.",
     *  "city": "Mountain View",
     *  "region": "California",
     *  "country": "US",
     *  "phone": 650
     *
     * @requires "$http"
     * @param  $http
     * @return ajax json object
     */

    clientDataService.service("ClientDataService", [
        "$http",
        function ($http) {

            var service = this;
            service.getClientData = function () {
               return $http.get('http://ipinfo.io/json');
            };

        }]);


})();
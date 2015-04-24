/**
 * Description of mainService.js
 *
 * @author daniele centamore
 * @email "daniele.centamore@gmail.com"
 */

(function() {




// MODULE TO MANAGE SERVICES
    var mainService = angular.module('mainService', [])
                .constant('TWEETS_HISTORY', "http://localhost/portofinoApi/web/app_dev.php/tweets/history")
                .constant('TWEETS_HISTORY_ID', "http://localhost/portofinoApi/web/app_dev.php/tweets/history/")
                .constant('GET_LOCATION_BY_IP', "http://localhost/portofinoApi/web/app_dev.php/tweets/location/data")
                .constant('TWEETS_SEARCH', "http://localhost/portofinoApi/web/app_dev.php/tweets/search");
        
        
        
    /**
     * TweetsHistoryService() 
     * rest web service 
     *
     * @requires "$http", "TWEETS_HISTORY"
     * @param  $http, TWEETS_HISTORY
     * @return ajax object
     */

    mainService.service("TweetsHistoryService", [
        "$http",
        "TWEETS_HISTORY",
            function($http,
                     TWEETS_HISTORY) {

            var service = this;

            service.getTweetsHistory = function() {

                return $http.get(TWEETS_HISTORY);

            };


        }]);

    

    /**
     * TweetsHistoryByIdService() 
     * rest web service
     *
     * @requires "$http", "TWEETS_HISTORY_ID"
     * @param  $http, TWEETS_HISTORY_ID
     * @return ajax object
     */

    mainService.service("TweetsHistoryByIdService", [
        "$http",
        "TWEETS_HISTORY_ID",
            function($http,
                     TWEETS_HISTORY_ID) {

            var service = this;
            service.getTweetsHistoryById = function(id) {  
                
                return $http.get(TWEETS_HISTORY_ID + id); 
            };

        }]);
    
    
    /**
     * LocationByIpService() 
     * rest web service
     *
     * @requires "$http", "GET_LOCATION_BY_IP"
     * @param  $http, GET_LOCATION_BY_IP
     * @return ajax object
     */

    mainService.service("LocationByIpService", [
        "$http",
        "GET_LOCATION_BY_IP",
            function($http,
                     GET_LOCATION_BY_IP) {

            var service = this;
            service.getLocationByIp= function() {  
                
                return $http.get(GET_LOCATION_BY_IP); 
            };

        }]);
    
    
    
    /**
     * TweetsSearchService() 
     * rest web service
     *
     * @requires "$http", "TWEETS_SEARCH"
     * @param  $http, TWEETS_SEARCH
     * @return ajax object
     */

    mainService.service("TweetsSearchService", [
        "$http",
        "TWEETS_SEARCH",
            function($http,
                     TWEETS_SEARCH) {

            var service = this;
            service.search= function(query) { 
                
                 console.log(TWEETS_SEARCH + query);
                return $http.get(TWEETS_SEARCH +query, { cache: false}); 
                
            };

        }]);



})();
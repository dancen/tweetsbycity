
/**
 * Description of mainFactory.js
 *
 * @author daniele centamore
 * @email "daniele.centamore@gmail.com"
 */



(function () {


    // module
    var mainFactory = angular.module('mainFactory', []);


    /**
     * AppFactory() 
     * static factory
     * 
     * single access point to angular services
     * and core application factories
     *
     * @param  
     * @return object 
     */


    mainFactory.factory('AppFactory', [
        "$anchorScroll",
        "$window",
        "$location",
        "$timeout",
        function ($anchorScroll,
                $window,
                $location,
                $timeout) {

            function AppFactory() {
            }
            ;

            AppFactory.prototype.anchorScroll = function () {
                return $anchorScroll;
            };

            AppFactory.prototype.location = function () {
                return $location;
            };


            AppFactory.prototype.timeout = function () {
                return $timeout;
            };
            
            
            AppFactory.prototype.window = function () {
                return $window;
            };

            return new AppFactory;


        }]);



    /**
     * ServiceFactory() 
     * static factory
     *
     * single access point to
     * application REST services
     * 
     * @param  
     * @return object 
     */


    mainFactory.factory('ServiceFactory', [
        "TweetsHistoryService",
        "TweetsHistoryByIdService",
        "LocationByIpService",
        "TweetsSearchService",
        "ClientDataService",
        function (TweetsHistoryService,
                TweetsHistoryByIdService,
                LocationByIpService,
                TweetsSearchService,
                ClientDataService) {

            function ServiceFactory() {
            }
            ;

            ServiceFactory.prototype.TweetsHistoryService = function () {
                return TweetsHistoryService;
            };

            ServiceFactory.prototype.TweetsHistoryByIdService = function () {
                return TweetsHistoryByIdService;
            };
            
            ServiceFactory.prototype.LocationByIpService = function () {
                return LocationByIpService;
            };
            
            ServiceFactory.prototype.TweetsSearchService = function () {
                return TweetsSearchService;
            };
            
            ServiceFactory.prototype.ClientDataService = function () {
                return ClientDataService;
            };


            return new ServiceFactory;


        }]);
    
    
     /**
     * LinkFactory() 
     * static factory - utility factory
     *
     * single access point to
     * application REST services
     * 
     * @param  string
     * @return string 
     */
    
    
    mainFactory.factory('LinkFactory', function () {

            function LinkFactory() {
            }
            ;

            LinkFactory.prototype.find = function (text) {
                return text.lastIndexOf("http") > -1;
            };         
            
            LinkFactory.prototype.getLink = function (text) {                
                var startpos = text.indexOf("http");
                var newtext = text.slice(startpos,text.length);
                var link = newtext.slice(0,newtext.length);                 
                return link;
            }; 
            
            LinkFactory.prototype.generateLink = function (link) {                
                return "<a href='"+link+"' target='_blank'>"+link+"</a>";
            }; 
            
            LinkFactory.prototype.exec = function (text) {
                var link = this.getLink(text);
                var linked = this.generateLink(link);
                var replaced = text.replace(link,linked);
                return replaced;
            };

            return new LinkFactory;

        });
        
    




})();
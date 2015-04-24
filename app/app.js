/**
 * Description of app.js
 *
 * @author daniele centamore
 * @email "daniele.centamore@gmail.com"
 */

(function () {



    // main module
    var tweetsApp = angular.module('tweetsApp', ["ngRoute",
        'mainController',       
        'mainFactory',
        'mainDirective',
        'mainFilter',
        'mainService',
        'clientDataService'])
            .constant('forcedTimeoutLoader', 500);
    ;

    // application config
    tweetsApp.config(function ($routeProvider) {

        $routeProvider.when("/", {
            templateUrl: "./app/scripts/views/partials/search.html"

        }).when("/history", {
            templateUrl: "./app/scripts/views/partials/history.html"

        }).otherwise({
            redirectTo: '/',
        });

    });

    // remove template cache
    tweetsApp.run(function ($rootScope, $templateCache) {
        $rootScope.$on('$viewContentLoaded', function () {
            $templateCache.removeAll();
        });
    });


    




})();
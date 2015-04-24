/**
 * Description of app.js
 *
 * @author daniele centamore
 * @email "daniele.centamore@gmail.com"
 */

(function () {

// application twittsbylocation
// https://www.delfrantoio.com/portofino/twitts.html
// Consumer Key (API Key) gkyPXmrbP8dYaChX2lf6jJLjY 
// Consumer Secret (API Secret) iUYC9OVJnvb7UWeAcwXH364sAPDLa907ApVJA6kn32Bm5faVUe
// Access Level Read and write (modify app permissions)
// Owner dancentamore
// Owner ID 2987914385


//my twitter account
//Access Token 2987914385-lpbrDBcXi8r505Zq6zU9JnF5Kqu7YWGdj3PgB8P
//Access Token Secret Gr9BdmlBEXu999h6FfQIjQSnPaGFieunGTggDzeBmvm8V
//Access Level Read and write
//Owner dancentamore
//Owner ID 2987914385


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
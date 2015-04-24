
/**
 * Description of mainController.js
 *
 * @author daniele centamore
 * @email "daniele.centamore@gmail.com"
 */

(function () {



    // module
    var mainController = angular.module('mainController', []);

    /**
     * MainController
     * manage common functionalities
     *
     * @requires "AppFactory", "$scope", "forcedTimeoutLoader", "ServiceFactory", "LinkFactory" 
     * @param AppFactory, $scope, forcedTimeoutLoader, ServiceFactory, LinkFactory
     * @return void
     */

    mainController.controller("MainController", [
        "AppFactory",
        "$scope",
        "forcedTimeoutLoader",
        "ServiceFactory",
        "LinkFactory",
        function (
                AppFactory,
                $scope,
                forcedTimeoutLoader,
                ServiceFactory,
                LinkFactory) {



            // initialize scope variables
            $scope.map;
            $scope.lat;
            $scope.lng;
            $scope.query;
            $scope.search_location = "???";
            $scope.caching = false;
            $scope.locations = [];
            $scope.markers = [];
            $scope.searching = true;
            $scope.start_city;
            $scope.history = [];
            $scope.numresults = 0;


            // spinner loader boolean 
            $scope.isLoading = false;

            /**
             *  start the spinner loader
             *              
             */

            $scope.startLoader = function () {
                $scope.isLoading = true;
            };



            /**
             *  stop the spinner loader
             *              
             */

            $scope.stopLoader = function () {
                $scope.isLoading = false;
            };


            /**
             *  scroll to the section 
             *              
             */

            $scope.gotoAnchor = function (x) {

                // scroll to section
                AppFactory.anchorScroll()(x);

            };


            /**            
             * the following methods are accessor methods set / get
             * to manage google map variables shared by different
             * asyncronous calls methods
             *
             * @param  string get and set parameters
             * @return      void
             * @see         void
             */

            $scope.setLatitude = function (l) {

                $scope.lat = l;
            };

            $scope.getLatitude = function () {

                return $scope.lat;
            };

            $scope.setLongitude = function (l) {

                $scope.lng = l;
            };

            $scope.getLongitude = function () {

                return $scope.lng;
            };

            $scope.setLocation = function (loc) {
                $scope.search_location = loc;
            };

            $scope.getLocation = function () {
                return $scope.search_location;
            };


            $scope.isSearching = function () {
                return $scope.searching;
            };

            $scope.getNumResult = function () {
                return $scope.numresults;
            };


            $scope.setNumResult = function (num) {
                $scope.numresults = num;
            };







            /**
             * this method is invoked by the angular repeat directive in
             * in the history page. The getHistory method invoke the spinner loader
             * then execute a ajax calls to retrieve the history data 
             * from the server. the scope variable is set with a timeout 
             * to manage latency issues.              
             *             
             * @param       void
             * @return      void
             * @see         void
             */

            $scope.getHistory = function () {

                // start the loader
                $scope.startLoader();

                // call the ajax rest service to 
                // get all data history of the user
                // stored as a cookie data
                var call = ServiceFactory.TweetsHistoryService().getTweetsHistory();
                call.success(function (data) {

                    // start a timeout to ensure
                    // latency time issues
                    AppFactory.timeout()(function () {

                        // set the array
                        // go to the section
                        // and stop the loader
                        $scope.history = data;
                        $scope.gotoAnchor("history")
                        $scope.stopLoader();

                    }, forcedTimeoutLoader);

                }).error(function (data) {
                    console.log("error getHistory");
                });

            };





            /**
             * this method creates an instance of google.maps.Geocoder in order
             * to retrieve latitude and longitude by the city selected by
             * the history list in the user page. latitude and longitude 
             * will be used to retrieve tweets by city. The method invoke 
             * in chain the loadHistory method passing the id of the database
             * record. 
             *             
             * @param       city - the city name 
             * @param       id - the id related to the database primary ID
             * @return      void
             * @see         void
             */

            $scope.initHistory = function (city, id) {


                var geocoder = new google.maps.Geocoder();

                geocoder.geocode({"address": city}, function (results, status) {

                    // If the Geocoding was successful
                    if (status == google.maps.GeocoderStatus.OK) {

                        // Create a Google Map at the latitude/longitude returned by the Geocoder.
                        $scope.lat = results[0].geometry.location.lat();
                        $scope.lng = results[0].geometry.location.lng();

                        $scope.loadHistory(id);

                    }
                });


            };







            /**
             * this method loads the tweets from database by primary id
             * calling the rest service TweetsHistoryByIdService.
             * For each tweet a new object is created with properties
             * needed by the google map object (coordinates, image etc.)
             * when loop has terminated the initialize() method is invoked
             * in order to create the map with multiple markers.
             *                          
             * @param       id - the id related to the database primary ID
             * @return      void
             * @see         void
             */


            $scope.loadHistory = function (id) {


                var call = ServiceFactory.TweetsHistoryByIdService().getTweetsHistoryById(id);
                call.success(function (data) {

                    try {

                        var json = JSON.parse(data);
                        $scope.isLoading = false;
                        $scope.searching = true;


                        if (json.statuses.length > 0) {

                            $scope.setNumResult(json.statuses.length);
                            console.log(json.statuses.length);

                            AppFactory.timeout()(function () {
                                for (var i = 0; i < json.statuses.length; i++) {

                                    if (json.statuses[i].geo) {

                                        var tweetobj = {
                                            content: json.statuses[i].text,
                                            date: json.statuses[i].created_at,
                                            image: json.statuses[i].user.profile_image_url,
                                            name: json.statuses[i].user.name,
                                            coordinates: json.statuses[i].geo.coordinates
                                        };

                                        $scope.locations.push(tweetobj);
                                    }

                                    if (i === (json.statuses.length - 1)) {

                                        $scope.initialize();
                                    }
                                }

                            }, forcedTimeoutLoader);

                        } else {

                            $scope.isLoading = false;
                            $scope.searching = false;
                            console.log("error loadHistory");
                            $scope.setNumResult(0);
                        }

                    } catch (e) {
                        console.log("error loadHistory " + e);
                        $scope.isLoading = false;
                        $scope.searching = false;
                        $scope.setNumResult(0);
                    }

                }).error(function (data) {
                    console.log("error loadHistory");
                    $scope.setNumResult(0);
                });

            };






            /**
             * this method initializes the first calls to get the city
             * name of the user by ip address in order to create the map
             * by google place api service. The method set the scope 
             * variable start_city and invoke the init() method.
             *                           
             * @param       void
             * @return      void
             * @see         void
             */

            $scope.startService = function () {

                // get the client data using the rest service from http://ipinfo.io/json
                var call = ServiceFactory.ClientDataService().getClientData();
                call.success(function (data) {

                    try {

                        AppFactory.timeout()(function () {
                            $scope.start_city = data.city;
                            console.log(data);
                            $scope.init();

                        }, forcedTimeoutLoader);

                    } catch (e) {
                        console.log("error ClientDataService " + e);
                        $scope.stopLoader();
                    }

                }).error(function (error) {


                    // in case the http://ipinfo.io/json is not available
                    // a customized service will be executed by using
                    // the server as a proxy
                    var call = ServiceFactory.LocationByIpService().getLocationByIp();
                    call.success(function (data) {

                        var json = JSON.parse(data);

                        AppFactory.timeout()(function () {

                            $scope.start_city = json.results[1].address_components[1].long_name;
                            $scope.init();

                        }, forcedTimeoutLoader);

                    }).error(function (data) {
                        console.log("error startService");
                    });

                    console.log("error ClientDataService");
                    $scope.stopLoader();
                });


            };







            /**
             * this method create an instance of google.maps.Geocoder in order
             * to create the google map in the  map-canvas element. 
             * the geocoder method is invoked passing as parameter address
             * the city that the user digits in the city input field.
             *                         
             * @param       void
             * @return      void
             * @see         void
             */

            $scope.init = function () {

                // start the loader
                $scope.startLoader();

                // get the element input value
                $scope.search_location = angular.element("#city").val();

                if (!$scope.search_location) {
                    $scope.search_location = $scope.start_city;
                }

                var geocoder = new google.maps.Geocoder();

                geocoder.geocode({"address": $scope.search_location}, function (results, status) {

                    // If the Geocoding was successful
                    if (status == google.maps.GeocoderStatus.OK) {

                        // Create a Google Map at the latitude/longitude returned by the Geocoder.
                        $scope.lat = results[0].geometry.location.lat();
                        $scope.lng = results[0].geometry.location.lng();

                        // invoke the method searchService()
                        $scope.searchService();

                    }
                });

            };







            /**
             * this method invokes the TweetsSearchService in order
             * to retrieve tweets by city, lat, and lng.
             * For each tweet a new object is created with properties
             * needed by the google map object (coordinates, image etc.)
             * when loop has terminated the initialize() method is invoked
             * in order to create the map with multiple markers.
             *                          
             * @param       id - the id related to the database primary ID
             * @return      void
             * @see         void
             */

            $scope.searchService = function () {


                var query = "?city=" + $scope.getLocation() + "&lat=" + $scope.getLatitude() + "&lng=" + $scope.getLongitude();

                var call = ServiceFactory.TweetsSearchService().search(query);

                call.success(function (data) {

                    try {

                        var json = data;

                        $scope.isLoading = false;
                        $scope.searching = true;

                        if (json.statuses.length > 0) {

                            $scope.setNumResult(json.statuses.length);
                            console.log(json.statuses.length);

                            AppFactory.timeout()(function () {
                                for (var i = 0; i < json.statuses.length; i++) {

                                    if (json.statuses[i].geo) {

                                        var tweetobj = {
                                            content: json.statuses[i].text,
                                            date: json.statuses[i].created_at,
                                            image: json.statuses[i].user.profile_image_url,
                                            name: json.statuses[i].user.name,
                                            coordinates: json.statuses[i].geo.coordinates
                                        };

                                        $scope.locations.push(tweetobj);

                                    }


                                    if (i === (json.statuses.length - 1)) {

                                        $scope.initialize();
                                    }
                                }

                            }, forcedTimeoutLoader);

                        } else {

                            $scope.isLoading = false;
                            $scope.searching = false;
                            console.log("error searchService not found");
                            $scope.setNumResult(0);
                        }

                    } catch (e) {
                        console.log("error searchService " + e);
                        $scope.isLoading = false;
                        $scope.searching = false;
                        $scope.setNumResult(0);
                    }

                }).error(function (data) {
                    console.log("error searchService");
                    $scope.stopLoader();
                    $scope.setNumResult(0);
                });


            };







            /**
             * this method creates an instance of google.maps.Geocoder in order
             * to create the google map in the  map-canvas element
             *                         
             * @param       void
             * @return      void
             * @see         void
             */


            $scope.initialize = function () {

                /* Lat. and Lon. of the center of the map */
                $scope.myCenter = new google.maps.LatLng($scope.lat, $scope.lng);

                // Create a map object, and include the MapTypeId to add
                // to the map type control.
                $scope.mapOptions = {
                    zoom: 13, //zoom level
                    center: $scope.myCenter, //center position
                    scrollwheel: false, //zoom when scroll disable
                    zoomControl: true, //show control zoom
                    mapTypeId: google.maps.MapTypeId.ROAD

                };

                $scope.map = new google.maps.Map(window.document.getElementById('map-canvas'), $scope.mapOptions);

                $scope.request = {
                    location: $scope.myCenter,
                };

                $scope.setMarkers($scope.map);

            };







            /**
             * this method set markers in google map creating the
             * info window object with content retrieved from 
             * twitter api service. The info window has a max width
             * of 250 pixel and icons have 50px width. The LinkFactory
             * class finds any http link text and transform it in a
             * real link append an <a element in the info window content
             *                           
             * @param       map - google map object
             * @return      void
             * @see         void
             */

            $scope.setMarkers = function (map) {

                for (var i = 0; i < $scope.locations.length; i++) {

                    var coord = $scope.locations[i].coordinates;

                    console.log($scope.locations[i].content);

                    var contentString = '<div class="infowindow"><h4>' + $scope.locations[i].name + '</h4>' + LinkFactory.exec($scope.locations[i].content) + '<hr /> ' + $scope.locations[i].date + '</div>';

                    var pic = {
                        url: $scope.locations[i].image,
                        // This marker is 20 pixels wide by 32 pixels tall.
                        size: new google.maps.Size(50, 50),
                        // The origin for this image is 0,0.
                        origin: new google.maps.Point(0, 0),
                        // The anchor for this image is the base of the flagpole at 0,32.
                        anchor: new google.maps.Point(0, 50)
                    };

                    var shape = {
                        coords: [0, 0, 0, 50, 50, 50, 50, 0],
                        type: 'poly'
                    };


                    $scope.myLatLng = new google.maps.LatLng(coord[0], coord[1]);
                    var marker = new google.maps.Marker({
                        position: $scope.myLatLng,
                        map: map,
                        icon: pic,
                        shape: shape,
                        title: $scope.locations[i].name,
                        zIndex: 100 + i
                    });

                    marker.html = contentString;
                    $scope.markers.push(marker);


                }


                for (var y = 0; y < $scope.markers.length; y++) {
                    var infowindow = new google.maps.InfoWindow({maxWidth: 250});
                    var marker = $scope.markers[y];
                    var content = marker.html;
                    google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                        return function () {
                            infowindow.setContent(content);
                            infowindow.open(map, marker);
                        };
                    })(marker, content, infowindow));

                }

            };


        }]);


})();
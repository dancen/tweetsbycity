
/**
 * Description of mainDirective.js
 *
 * @author daniele centamore
 * @email "daniele.centamore@gmail.com"
 */





(function () {


    // module
    var mainDirective = angular.module('mainDirective', []);


    /**
     * compile 
     * compile element directive
     *
     * @requires "$compile"
     * @param  $compile
     * @return void
     *     
     */

    mainDirective.directive('compile', ['$compile', function ($compile) {
            return function (scope, element, attrs) {
                scope.$watch(
                        function (scope) {
                            // watch the 'compile' expression for changes
                            return scope.$eval(attrs.compile);
                        },
                        function (value) {
                            // when the 'compile' expression changes
                            // assign it into the current DOM
                            element.html(value);

                            // compile the new DOM and link it to the current
                            // scope.
                            // NOTE: we only compile .childNodes so that
                            // we don't get into infinite loop compiling ourselves
                            // <span compile="waiting_time_lable"></span>
                            $compile(element.contents())(scope);
                        }
                );
            };
        }]);




})();
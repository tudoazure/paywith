"use strict";
_payWithPaytm.controller('menuController', ["$scope", "$location",
    function ($scope, $location) {
        // create a message to display in our view


        $scope.isActive = function (route) {

            return route == $location.$$path;
        };
}]);
"use strict";
_payWithPaytm.controller('paymentsController', ["$scope", "$location",

    function ($scope, $location) {
        // create a message to display in our view
        $scope.message = 'Payments view controller';
        $scope.$path = $location.$$path;
}]);
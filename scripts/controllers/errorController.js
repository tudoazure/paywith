"use strict";
_payWithPaytm.controller('helpController', ["$scope", "$location", "$routeParams",
    function ($scope, $location, $routeParams) {
        if ($routeParams.id == 101) {
            $scope.message = 'Oops! Your browser seems to have cookies disabled. Make sure cookies are enabled or try opening a new browser window';
        }
}]);
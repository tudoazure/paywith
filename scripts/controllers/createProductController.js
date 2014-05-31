"use strict";
_payWithPaytm.controller('createProductController', ["$scope", "$location",
    function ($scope, $location) {
        $scope.message = 'Create product view controller';
        $scope.custom_params = [{
            "key": "",
            "value": ""
    }];
        $scope._append_fields = function () {
            $scope.custom_params.push({
                "key": "",
                "value": ""
            });
        };
        $scope._trash_custom_div = function (id) {
            $scope.custom_params.splice(id, 1);
        };
}]);
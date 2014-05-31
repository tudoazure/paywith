"use strict";
_payWithPaytm.controller('editProductController', ["$scope", "$location", "$routeParams", "productDetailFactory", "config", "Analytics",
    function ($scope, $location, $routeParams, productDetailFactory, config, Analytics) {

        /** Analytics Start **/
        Analytics.trackPage('/products/edit/' + $routeParams.id);
        /** Analytics End **/

        // create a message to display in our view
        $scope.message = 'Edit Product view controller';
        $scope.custom_params = [];

        $scope._append_fields = function () {
            $scope.custom_params.push({
                "key": "",
                "value": ""
            });
        };

        $scope._trash_custom_div = function (id) {
            $scope.custom_params.splice(id, 1);
        };

        var handleSuccess = function (data, status) {
            //when session code invalid
            if (data.status == 117) {
                $location.path('/logout');
            }
            var media = angular.fromJson(data.data.media);


            $scope.title = data.data.title;
            $scope.price = data.data.amount;
            $scope.description = data.data.description;
            $scope.pid = data.data.button_id;
            $scope.previewImageUrl = media.preview_image;
            $scope.watermark_enabled = data.data.watermark_enabled;
            console.log(media.preview_image);
            if (media.preview_image === undefined || media.preview_image === "") {
                $scope.previewImgDiv = true;
            }
            var c_params = angular.fromJson(data.data.custom_params)

            angular.forEach(c_params, function (value, key) {
                $scope.custom_params.push({
                    "key": key,
                    "value": value
                });

            });

        };

        productDetailFactory.details($routeParams.id, config.API_HOST + appConstants.GET_MERCHANDISE_INFO).success(handleSuccess);

}]);
"use strict"
_payWithPaytm.controller('buttonController', ["$scope", "$location", "$routeParams", "config", "Analytics", "buttonFactory", "$cookies", "buttonService", "$modal",

    function ($scope, $location, $routeParams, config, Analytics, buttonFactory, $cookies, buttonService, $modal) {
        $scope.loading = false;
        $scope.buttonForm = false;
        $scope.buttonScriptDiv = false;
        $scope.buttonList = false;
        $scope.createButton = false;
        switch ($location.path()) {
        case "/button/update/" + $routeParams.id:
            /** Analytics Start **/
            Analytics.trackPage('/button/update/' + $routeParams.id);
            /** Analytics End **/

            $scope.buttonSubmitText = "Update Details";
            var formData = new FormData();
            formData.append("session_token", $cookies.paytm_session_key);

            var buttonUrl = appConfig.API_HOST + appConstants.BUTTON_LIST + $routeParams.id + "/";
            buttonFactory.buttonDetails(formData, buttonUrl).success(function (response) {

                var button = response.data;
                $scope.button = button;
                $scope.button_id = button.button_id;
                $scope.button_name = button.button_name;

                if (button.title === 'undefined' || button.title === undefined || button.title === '') {

                    $scope.title = "";
                    $scope.titleDisabled = false;
                } else {
                    $scope.titleDisabled = true;
                    $scope.title = button.title;
                }

                if (button.amount === undefined || button.amount === 'undefined' || button.amount === '') {
                    $scope.amount = "";
                    button.amountDisabled = false;
                } else {
                    $scope.amountDisabled = true;
                    $scope.amount = button.amount;
                }

                $scope.description = button.description;
                $scope.return_success_url = button.return_success_url;
                $scope.return_cancel_url = button.return_cancel_url;
                $scope.notify_url = button.notify_url;
                $scope.custom_params = button.custom_params;
                $scope.buttonConfirmMessage = "Button updated";
            });

            $scope.buttonForm = true;


            break;
        case "/button/create":

            /** Analytics Start **/
            Analytics.trackPage(' /button/create/ ');
            /** Analytics End **/

            $scope.buttonSubmitText = "Save Details";
            $scope.buttonForm = true;
            $scope.buttonConfirmMessage = "Button created successfully";



            break;
        case "/button":

            /** Analytics Start **/
            Analytics.trackPage('/button/');
            /** Analytics End **/
            $scope.loading = true;
            $scope.viewSecret = true;
            var formData = new FormData();
            formData.append("session_token", $cookies.paytm_session_key);
            var buttonUrl = appConfig.API_HOST + appConstants.BUTTON_LIST;
            $scope.action = function (path) {

                $location.path(path);
            };
            //pagination 
            $scope.limit = false;
            $scope.prevLimit = true;
            $scope.nextLimit = true;
            $scope.future = null;
            $scope.past = null;

            //has to be removed on enabling pagination
            $scope.paginationDiv = true;

            buttonPaginationCtrl($scope, formData, buttonUrl, buttonFactory, buttonService);

            if ($scope.limit) {
                $scope.prevLimit = $scope.limit;
                $scope.nextLimit = $scope.limit;
            } else {

                $scope.nextLimit = false;
            }

            console.log($scope.nextLimit);



            $scope.prevPage = function () {
                console.log("limit :" + $scope.limit);
                console.log("prev limit :" + $scope.prevLimit);
                if (!$scope.prevLimit) {
                    buttonUrl = config.API_HOST + appConstants.BUTTON_LIST + "?&" + $scope.future;
                    buttonPaginationCtrl($scope, formData, buttonUrl, buttonFactory, buttonService);
                    if ($scope.limit == true) {
                        $scope.prevLimit = true;
                        $scope.nextLimit = false;
                    } else {
                        $scope.prevLimit = false;
                        $scope.nextLimit = false;
                    }
                }


            };

            $scope.nextPage = function () {
                if (!$scope.nextLimit) {
                    buttonUrl = config.API_HOST + appConstants.BUTTON_LIST + "?" + $scope.past;

                    buttonPaginationCtrl($scope, formData, buttonUrl, buttonFactory, buttonService);

                    if ($scope.limit == true) {

                        $scope.nextLimit = true;
                        $scope.prevLimit = false;

                    } else {
                        $scope.nextLimit = false;
                        $scope.prevLimit = false;
                    }
                }


            };




            break;
        }


        $scope.openScriptModal = function (button) {

            var modalInstance = $modal.open({
                templateUrl: 'buttonScriptModal.html',
                controller: buttonModalCtrl,
                resolve: {
                    button_id: function () {
                        return button.button_id;
                    },
                    buttonHost: function () {
                        return config.PAY_BUTTON_URL;
                    },
                    scriptParams: function () {
                        var param = "pptmdata-muoid=\"\"  pptmdata-custom_params=\"\" pptmdata-title=\"\" pptmdata-amount=\"\" pptmdata-custom_params=\"\" ";
                        var params = "pptmdata-muoid=\"\"  pptmdata-custom_params=\"\" ";
                        var flag = false;
                        angular.forEach(button, function (value, key) {


                            if (key === "amount") {
                                flag = true;
                            } else {
                                //params = params + " pptmdata-amount=\"\"";
                            }
                        });
                        if (!flag) {
                            params = params + "pptmdata-amount=\"\"";
                        }

                        return params;
                    }


                }
            });
        };


        $scope.viewSecretModal = function (button) {
            var modalInstance = $modal.open({
                templateUrl: 'viewSecretModal.html',
                controller: viewSecretModalCtrl,
                resolve: {
                    secret: function () {

                        return button.extra_params.secret;
                    }

                }
            });
        }

        $scope.amountDisable = function () {
            console.log($scope.amountDisabled);
            if ($scope.amountDisabled) {
                $scope.amount = "";
            }
        }

        $scope.titleDisable = function () {
            console.log($scope.titleDisabled);
            if ($scope.titleDisabled) {
                $scope.title = "";
            }
        }



            }]);



var buttonPaginationCtrl = function ($scope, formData, buttonUrl, buttonFactory, buttonService) {

    buttonFactory.buttonList(formData, buttonUrl).success(function (response) {
        if (response.status == 117) {
            $location.path('/logout');
        }
        if (response.status == 0) {
            if (response.data.buttons.length == 0) {
                $scope.loading = false;
                $scope.createButton = true;
                $scope.noDataMessage = "No data available.";
            } else {
                $scope.loading = false;
                $scope.buttonList = true;
                $scope.createButton = true;
                $scope.buttons = response.data.buttons;
                buttonService.buttonList = response.data.buttons;

                //                var pagination = response.data.pagination;
                //
                //                $scope.future = response.data.pagination.future;
                //                $scope.past = response.data.pagination.past;
                //                $scope.limit = response.data.pagination.limit;



            }
        }

    }).error(function (data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.loading = false;
        if (status == 500) {
            $scope.buttonList = false;
            $scope.buttonForm = false;
            $scope.buttonScriptDiv = false;

            $scope.noDataMessage = "Something gone wrong with our server";
        }
    });
};

//for minification
buttonPaginationCtrl.$inject = ["$scope", "formData", "buttonUrl", "buttonactory"];





var buttonModalCtrl = function ($scope, $modalInstance, button_id, buttonHost, scriptParams, Analytics) {

    Analytics.trackEvent("copyButtonScript");

    $scope.payButtonHost = buttonHost;

    $scope.button_id = button_id;
    $scope.scriptParams = scriptParams;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
//for minification 
buttonModalCtrl.$inject = ["$scope", "$modalInstance", "button_id", "buttonHost", "scriptParams", "Analytics"];


var viewSecretModalCtrl = function ($scope, $modalInstance, secret, Analytics) {
    Analytics.trackEvent("viewSecretScript");

    $scope.viewSecret = secret;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
//for minification 
viewSecretModalCtrl.$inject = ["$scope", "$modalInstance", "secret", "Analytics"];
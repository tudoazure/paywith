"use strict";

_payWithPaytm.controller('productsController', ["$scope", "productFactory", "$modal", "$log", "$window", "$location", "toggleActivityFactory", "config", "$cookies", "inviteEmailFactory", "Analytics",
        function ($scope, productFactory, $modal, $log, $window, $location, toggleActivityFactory, config, $cookies, inviteEmailFactory, Analytics) {
        /** Analytics Start **/
        Analytics.trackPage('/products');
        /** Analytics End **/
        var formData = new FormData();
        formData.append("session_token", $cookies.paytm_session_key);
        var productUrl = config.API_HOST + appConstants.GET_ALL_MERCHANDISE;
        //display loader
        $scope.loading = false;
        $scope.productsTable = true;
        $scope.searchResultDiv = true;


        $scope.createProduct = function (path) {
            $location.path(path);
        };
        //setting button host
        $scope.serverButtonHost = config.PAYMENT_BUTTON_HOST;
        $scope.inviteProcessLoader = true;

        //has to be removed on enabling pagination
        $scope.paginationDiv = true;

        //pagination 
        $scope.limit = false;
        $scope.prevLimit = true;
        $scope.nextLimit = true;
        $scope.future = null;
        $scope.past = null;

        productPaginationCtrl($scope, formData, productUrl, productFactory);

        if ($scope.limit) {
            $scope.prevLimit = $scope.limit;
            $scope.nextLimit = $scope.limit;
        } else {
            $scope.nextLimit = false;
        }


        $scope.prevPage = function () {
            console.log("limit :" + $scope.limit);
            console.log("prev limit :" + $scope.prevLimit);
            if (!$scope.prevLimit) {
                productUrl = config.API_HOST + appConstants.GET_ALL_MERCHANDISE + "?" + $scope.future;
                productPaginationCtrl($scope, formData, productUrl, productFactory);
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
                productUrl = config.API_HOST + appConstants.GET_ALL_MERCHANDISE + "?" + $scope.past;

                productPaginationCtrl($scope, formData, productUrl, productFactory);

                if ($scope.limit == true) {

                    $scope.nextLimit = true;
                    $scope.prevLimit = false;

                } else {
                    $scope.nextLimit = false;
                    $scope.prevLimit = false;
                }
            }


        };



        $scope.openScriptModal = function (product) {

            var modalInstance = $modal.open({
                templateUrl: 'scriptModal.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    pbid: function () {
                        return product.button_id;
                    },
                    paymentButtonHost: function () {
                        return config.PAYMENT_BUTTON_HOST;
                    },
                    payButtonHost: function () {
                        return config.PAY_BUTTON_URL;
                    }
                }
            });
        };

        $scope.openInviteModal = function (product) {

            $scope.inviteData = {
                emails: null
            };
            $scope.bproduct = {
                id: product.button_id
            };
            $scope.productID = product.button_id;

            var modalInstance = $modal.open({
                templateUrl: 'inviteModal.html',
                controller: InviteModalCtrl,
                resolve: {
                    pbid: function () {
                        return product.button_id;
                    },
                    inviteData: function () {
                        return $scope.inviteData;
                    }

                }
            });
        };

        $scope.productActive = function (product) {
            console.log(product.status);

            var toggleFormData = new FormData();
            if (product.status == 'ACTIVE') {
                product.status = "INACTIVE";
                toggleFormData.append("state", "INACTIVE");
            } else {
                product.status = "ACTIVE";
                toggleFormData.append("state", "ACTIVE");
            }

            toggleFormData.append("session_token", $cookies.paytm_session_key);
            toggleFormData.append("id", product.button_id);

            var toggleUrl = config.API_HOST + appConstants.SET_MERCHANDISE_STATE;
            toggleActivityFactory.toggle(toggleFormData, toggleUrl).success(function (response) {
                console.log(response.data.status);
            });

        };


            }]);



var productPaginationCtrl = function ($scope, formData, productUrl, productFactory) {

    productFactory.list(formData, productUrl).success(function (response) {
        //when session code invalid
        console.log(response);
        if (response.status == 117) {
            $location.path('/logout');
        }
        if (response.status == 0) {
            if (response.data.merchandises.length == 0) {

                $scope.loading = true;
                $scope.productsTable = true;
                $scope.searchResultDiv = true;
                $scope.noDataMessage = "No data available.";
            } else {
                $scope.products = response.data.merchandises;



                $scope.loading = true;
                $scope.productsTable = false;
                $scope.searchResultDiv = false;


//                var pagination = response.data.pagination;
//
//                $scope.future = response.data.pagination.future;
//                $scope.past = response.data.pagination.past;
//                $scope.limit = response.data.pagination.limit;

            }
        }
        if (response.status == 1) {
            $scope.productsTable = true;
            $scope.searchResultDiv = true;
            $scope.paginationDiv = true;
            $scope.noDataMessage = "Something gone wrong with our server";
        }

    }).error(function (data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.loading = true;
        if (status == 500) {
            $scope.productsTable = true;
            $scope.searchResultDiv = true;
            $scope.paginationDiv = true;

            $scope.noDataMessage = "Something gone wrong with our server";
        }
    });
};

//for minification
productPaginationCtrl.$inject = ["$scope", "formData", "buttonUrl", "buttonactory"];




var ModalInstanceCtrl = function ($scope, $modalInstance, pbid, payButtonHost, paymentButtonHost, Analytics) {
    Analytics.trackEvent("copyScript");

    $scope.serverButtonHost = paymentButtonHost;
    $scope.payButtonHost = payButtonHost;

    $scope.pbid = pbid;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

//for minification 
ModalInstanceCtrl.$inject = ["$scope", "$modalInstance", "pbid", "payButtonHost", "paymentButtonHost", "Analytics"];

var InviteModalCtrl = function ($scope, $modalInstance, pbid, inviteData, config, inviteEmailFactory, $cookies, emailValidityService, Analytics) {

    Analytics.trackEvent("inviteModal");

    $scope.pbid = pbid;
    $scope.inviteProcessLoader = true;
    $scope.inviteData = inviteData;
    $scope.productID = pbid;
    $scope.bproductid = pbid;

    $scope.cancel = function () {
        $modalInstance.close();

    };
    $scope.submit = function () {
        console.log(inviteData.emails);
        var valid = emailValidityService.isValid(inviteData.emails);



        var inviteEmailData = new FormData();
        var inviteUrl = config.API_HOST + appConstants.SEND_INVITE;
        inviteEmailData.append("session_token", $cookies.paytm_session_key);
        inviteEmailData.append("id", pbid);
        inviteEmailData.append("emails", inviteData.emails);
        if (valid) {
            $scope.inviteDataDiv = true;
            $scope.inviteTextArea = true;
            $scope.inviteProcessLoader = false;
            $scope.inviteInputDesc = true;
            inviteEmailFactory.invite(inviteEmailData, inviteUrl).success(function (response) {
                console.log(response);
                $scope.emailValidityAlert = "Email Sent";
                $scope.inviteProcessLoader = true;
            });
        } else {
            $scope.emailValidityAlert = "Invalid Emails";
        }
    };

    $scope.invite = function () {


        $modalInstance.close();
    };
};

//for minification
InviteModalCtrl.$inject = ["$scope", "$modalInstance", "pbid", "inviteData", "config", "inviteEmailFactory", "$cookies", "emailValidityService", "Analytics"];
"use strict";
_payWithPaytm.controller('salesController', ["$scope", "orderFactory", "$modal", "config", "$cookies", "$location", "Analytics",
    function ($scope, orderFactory, $modal, config, $cookies, $location, Analytics) {

        /** Analytics Start **/
        Analytics.trackPage('/sales');
        /** Analytics End **/

        //display loader
        $scope.loading = false;
        $scope.orderTable = true;
        $scope.searchResultDiv = true;
        $scope.paginationDiv = true;

        var formData = new FormData();
        formData.append("session_token", $cookies.paytm_session_key);

        var orderUrl = config.API_HOST + appConstants.ALL_ORDERS + "?status=SUCCESS,SETTLED&key=0";

        //pagination 
        $scope.limit = false;
        $scope.prevLimit = true;
        $scope.nextLimit = true;
        $scope.future = null;
        $scope.past = null;

        paginationCtrl($scope, formData, orderUrl, orderFactory, $modal, $location);

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
                orderUrl = config.API_HOST + appConstants.ALL_ORDERS + "?status=SUCCESS,SETTLED&" + $scope.future;
                paginationCtrl($scope, formData, orderUrl, orderFactory, $modal, $location);
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
                orderUrl = config.API_HOST + appConstants.ALL_ORDERS + "?status=SUCCESS,SETTLED&" + $scope.past;

                paginationCtrl($scope, formData, orderUrl, orderFactory, $modal, $location);

                if ($scope.limit == true) {

                    $scope.nextLimit = true;
                    $scope.prevLimit = false;

                } else {
                    $scope.nextLimit = false;
                    $scope.prevLimit = false;
                }
            }


        };

        $scope.openResendModal = function (order) {



            var modalInstance = $modal.open({
                templateUrl: 'reSendModal.html',
                controller: resendModalCtrl,
                resolve: {
                    resend_email: function () {
                        var c_params = order.custom_params;
                        console.log(order);
                        return c_params.d_email;
                    },
                    transaction_id: function () {
                        return order.transaction_id;
                    }
                }
            });
        };



}]);

var paginationCtrl = function ($scope, formData, orderUrl, orderFactory, $modal, $location) {
    orderFactory.list(formData, orderUrl).success(function (response) {
        $scope.loading = true;


        console.log(response);

        if (response.status == 117) {
            $location.path('/logout');
        }

        if (response.status == 123) {

            $scope.orderTable = true;
            $scope.searchResultDiv = true;
            $scope.paginationDiv = true;

            $scope.noDataMessage = "No data available.";
        }

        if (response.status == 0) {

            $scope.orderTable = false;
            $scope.searchResultDiv = false;
            $scope.paginationDiv = false;

            var orders = [];
            angular.forEach(response.data.transactions, function (value, key) {
                var order = {};
                order.title = value.custom_params.title;
                order.transaction_id = value.transaction_id;
                order.muoid = value.muoid;
                order.transaction_created_time = value.transaction_updated_time;
                order.amount = value.amount;
                order.status = value.status;
                order.parent_type = value.parent_type;
                order.custom_params = value.custom_params;
                orders.push(order);

            });

            $scope.orders = orders;
            $scope.transactions = response.data.transactions;

            console.log(response.data.transactions);

            var pagination = response.data.pagination;

            $scope.future = response.data.pagination.future;
            $scope.past = response.data.pagination.past;
            $scope.limit = response.data.pagination.limit;







            $scope.openViewModal = function (index) {
                var c_params = $scope.transactions[index].custom_params;

                $scope.custom_params = angular.fromJson(c_params.user_custom_params);

                $scope.items = {

                    "Transaction Id": $scope.transactions[index].transaction_id,
                    "Delivery Email": c_params.d_email,
                    "Title": c_params.title,
                    "Amount Paid": "Rs. " + $scope.transactions[index].amount,
                    "Date Purchased": moment($scope.transactions[index].transaction_updated_time).format("D MMMM YYYY h:m")
                };



                //deleting an undefined object
                delete $scope.custom_params.undefined;



                var modalInstance = $modal.open({
                    templateUrl: 'viewModal.html',
                    controller: openViewModalCtrl,
                    resolve: {
                        custom_params: function () {
                            return $scope.custom_params;
                        },
                        items: function () {
                            return $scope.items;
                        }
                    }
                });

            };
        }

    }).error(function (data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.loading = true;
        if (status == 500) {
            $scope.orderTable = true;
            $scope.searchResultDiv = true;
            $scope.paginationDiv = true;

            $scope.noDataMessage = "Something gone wrong with our server";
        }
    });
};

//for minification
paginationCtrl.$inject = ["$scope", "formData", "orderUrl", "orderFactory", "$modal", "$location"];

var openViewModalCtrl = function ($scope, $modalInstance, items, custom_params, Analytics) {
    Analytics.trackEvent("viewDetailsModal");
    $scope.items = items;

    $scope.custom_params = custom_params;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
//for minification
openViewModalCtrl.$inject = ["$scope", "$modalInstance", "items", "custom_params", "Analytics"];
var resendModalCtrl = function ($scope, $modalInstance, resend_email, transaction_id, inviteEmailFactory, config, $cookies, Analytics) {

    /** Analytics Start **/
    Analytics.trackEvent('resendModal');
    /** Analytics End **/


    $scope.yes = function () {

        var inviteData = resend_email;
        var inviteEmailData = new FormData();
        var inviteUrl = config.API_HOST + appConstants.RESEND_MERCHANDISE;
        inviteEmailData.append("session_token", $cookies.paytm_session_key);
        inviteEmailData.append("transaction_id", transaction_id);
        inviteEmailData.append("d_email", inviteData);

        inviteEmailFactory.invite(inviteEmailData, inviteUrl).success(function (response) {
            console.log(response);
        });
        $modalInstance.dismiss('cancel');
    };


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
//for minification
resendModalCtrl.$inject = ["$scope", "$modalInstance", "resend_email", "transaction_id", "inviteEmailFactory", "config", "$cookies", "Analytics"];
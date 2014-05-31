"use strict";
_payWithPaytm.controller("loginController", ["$scope", "$location", "$cookieStore", "config",
    function ($scope, $location, $cookieStore, config) {
        $scope.message = "Welcome to paywithpaytm ";

        $cookieStore.remove("paytm_session_key");
        $cookieStore.remove("ses_user");

        $scope.loginOauth = function () {
            window.location = config.OAUTH_HOST + "oauth2/authorize?client_id=" + config.OAUTH_CLIENT_ID + "&scope=paytm&response_type=code&redirect_uri=" + config.OAUTH_REDIRECT_URI;
        };

}]);
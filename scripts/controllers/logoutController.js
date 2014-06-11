"use strict";
_payWithPaytm.controller("logoutController", ["$scope", "$location", "$cookies", "$cookieStore",
        function ($scope, $location, $cookies, $cookieStore) {

        $cookieStore.remove("paytm_session_key");
        $cookieStore.remove("ses_user");
        $cookieStore.remove("paytm_user");
        $cookieStore.remove("transaction_id");
        $cookieStore.remove("is_profile");

        deleteCookie("paytm_session_key");
        deleteCookie("ses_user");
        deleteCookie("paytm_user");
        deleteCookie("transaction_id");
        deleteCookie("is_profile");



        $location.path('/login');



}]);

var deleteCookie = function (name) {
    createCookie(name, "", -1);
};

var createCookie = function (name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + ";domain=." + window.location.hostname + "; path=/";

}
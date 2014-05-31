"use strict";
_payWithPaytm.controller('profileController', ["$scope", "$location", "$routeParams", "config", "Analytics", "profileFactory", "$cookies",

    function ($scope, $location, $routeParams, config, Analytics, profileFactory, $cookies) {
        // create a message to display in our view
        $scope.message = 'Profile view controller';
        var profile = angular.fromJson($cookies.paytm_user);

        console.log(profile);

        switch ($location.path()) {
        case "/profile/update":

            if (profile === undefined) {

            } else {
                $scope.first_name = (profile.first_name === 'undefined') ? "" : profile.first_name;
                $scope.middle_name = (profile.middle_name === 'undefined') ? "" : profile.middle_name;
                $scope.last_name = (profile.last_name === 'undefined') ? "" : profile.last_name;
                $scope.user_email = (profile.email === 'undefined') ? "" : profile.email;
                $scope.user_mobile = (profile.mobile === 'undefined') ? "" : profile.mobile;
            }


            break;
        case "/profile/edit" + $routeParams.id:

            /** Analytics Start **/
            Analytics.trackPage('/profile/edit/' + $routeParams.id);
            /** Analytics End **/


            break;
        case "/profile":
            if (profile === undefined) {

            } else {
                $scope.first_name = (profile.first_name === 'undefined') ? "" : profile.first_name;
                $scope.middle_name = (profile.middle_name === 'undefined') ? "" : profile.middle_name;
                $scope.last_name = (profile.last_name === 'undefined') ? "" : profile.last_name;
                $scope.user_email = (profile.email === 'undefined') ? "" : profile.email;
                $scope.user_mobile = (profile.mobile === 'undefined') ? "" : profile.mobile;
            }
            break;
        }





}]);
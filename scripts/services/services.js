_payWithPaytm.service('authService', ['$cookies', '$rootScope',

    function ($cookies, $rootScope) {
        this.isAuthenticated = function () {
            if ($cookies.paytm_session_key) {
                $rootScope.session_token = $cookies.paytm_session_key;
                return true;
            } else {
                return false;
            }
        },
        this.userName = function () {
            return $cookies.ses_user;
        },
        this.sessionToken = function () {

            return $cookies.paytm_session_key;
        },
        this.isProfileComplete = function () {
            var profile = angular.fromJson($cookies.paytm_user);
            if (profile === undefined) {
                return false;
            } else {

                if (profile.first_name == undefined || profile.first_name == "") {
                    return false;
                } else {
                    return true;
                }
            }

        }

}]);

_payWithPaytm.service('emailValidityService', [

    function () {
        this.isValid = function (emails) {

            emailArray = emails;

            var isValid = true;
            for (var i = 0; i < emailArray.length && isValid == true; i++) {
                if (!this.validateEmail(emailArray[i].trim())) {
                    isValid = false;
                }
            };
            return isValid;
        },
        this.validateEmail = function (email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }


}]);

_payWithPaytm.service("cookieService", [

    function () {
        this.isCookieEnabled = function () {
            var cookieEnabled = (navigator.cookieEnabled) ? true : false
            if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
                document.cookie = "testcookie";
                cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
            }
            return (cookieEnabled) ? true : false;
        }
}]);

_payWithPaytm.service("buttonService", [

    function () {

        this.buttonList = [];

        this.buttonDetails = function (button_id) {
            var req_button = null;
            angular.forEach(this.buttonList, function (button, key) {

                if (button.button_id == button_id) {
                    req_button = button;
                }
            });

            return req_button;
        }
}]);
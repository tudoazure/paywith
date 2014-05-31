_payWithPaytm.factory("productFactory", ["$http",
        function ($http) {
        return {
            list: function (formData, url) {
                return $http.post(url, formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                });

            }
        };
}]);
_payWithPaytm.factory('productFormFactory', ["$http",
    function ($http) {
        return {
            productFormSubmit: function (formData, url) {
                return $http.post(url, formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                });

            }
        };
}]);

_payWithPaytm.factory("orderFactory", ["$http",
    function ($http) {
        return {
            list: function (formData, url) {
                return $http.post(url, formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                });
            }
        };
}]);

_payWithPaytm.factory("productDetailFactory", ["$http",
    function ($http) {
        return {
            details: function (pid, url) {
                return $http({
                    url: url + pid + "/",
                    method: "GET"
                });
            }
        };

}]);

_payWithPaytm.factory("toggleActivityFactory", ["$http",
        function ($http) {

        return {
            toggle: function (formData, url) {
                return $http.post(url, formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                });
            }
        };
}]);

_payWithPaytm.factory("inviteEmailFactory", ["$http",
    function ($http) {
        return {
            invite: function (formData, url) {
                return $http.post(url, formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                });
            }
        };
}]);


_payWithPaytm.factory("profileFactory", ["$http",
        function ($http) {
        return {
            profileFormSubmit: function (formData, url) {
                return $http.post(url, formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                });
            }
        };
}]);
_payWithPaytm.factory("buttonFactory", ["$http",

        function ($http) {
        return {
            buttonFormSubmit: function (formData, url) {
                return $http.post(url, formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                });
            },
            buttonList: function (formData, url) {
                return $http.post(url, formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                });
            },
            buttonDetails: function (formData, url) {
                return $http.post(url, formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                });
            }
        };
}]);
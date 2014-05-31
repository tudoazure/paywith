"use strict";
var _payWithPaytm = angular.module('payWithPaytm', ['ngRoute', 'ui.bootstrap', 'ngCookies', 'angular-google-analytics']);
_payWithPaytm
    .constant('config', {
        API_HOST: appConfig.API_HOST,
        APP_HOST: appConfig.APP_HOST,
        PAYMENT_BUTTON_HOST: appConfig.PAYMENT_BUTTON_HOST,
        OAUTH_CLIENT_ID: appConfig.OAUTH_CLIENT_ID,
        OAUTH_HOST: appConfig.OAUTH_HOST,
        OAUTH_REDIRECT_URI: appConfig.OAUTH_REDIRECT_URI,
        PAY_BUTTON_URL: appConfig.PAY_BUTTON_URL

    });

// configure our routes
_payWithPaytm.config(["$routeProvider", "$provide", "AnalyticsProvider", "$httpProvider",
        function ($routeProvider, $provide, AnalyticsProvider, $httpProvider) {

        $routeProvider
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'loginController',
                pageTitle: 'Login',
                access: {
                    isFree: true
                }
            })
            .when('/logout', {
                templateUrl: 'views/logout.html',
                controller: 'logoutController',
                pageTitle: 'Logout',
                access: {
                    isFree: false
                }
            })
            .when('/sales', {
                templateUrl: 'views/sales.html',
                controller: 'salesController',
                pageTitle: 'Sales',
                activetab: 'sales',
                access: {
                    isFree: false
                }
            })
            .when('/help', {
                templateUrl: 'views/help.html',
                controller: 'helpController',
                pageTitle: 'Help',
                activetab: 'help',
                access: {
                    isFree: false
                }
            })
            .when('/payments', {
                templateUrl: 'views/payments.html',
                controller: 'paymentsController',
                pageTitle: 'Payments',
                activetab: 'payments',
                access: {
                    isFree: false
                }
            })
            .when('/reports', {
                templateUrl: 'views/reports.html',
                controller: 'reportsController',
                pageTitle: 'Reports',
                activetab: 'reports',
                access: {
                    isFree: false
                }
            })
            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'profileController',
                pageTitle: 'Profile',
                activetab: 'profile',
                access: {
                    isFree: false
                }
            })
            .when('/profile/update', {
                templateUrl: 'views/profile.html',
                controller: 'profileController',
                pageTitle: 'Update Profile',
                activetab: 'profile',
                access: {
                    isFree: false
                }
            })
            .when('/profile/edit/:id', {
                templateUrl: 'views/profile.html',
                controller: 'profileController',
                pageTitle: 'Edit Profile',
                activetab: 'profile',
                access: {
                    isFree: false
                }
            })
            .when('/products', {
                templateUrl: 'views/products.html',
                controller: 'productsController',
                pageTitle: 'Products',
                activetab: 'products',
                access: {
                    isFree: false
                }

            })
            .when('/product/create/', {
                templateUrl: 'views/create-product.html',
                controller: 'createProductController',
                pageTitle: 'Create Product',
                access: {
                    isFree: false
                }
            })
            .when('/product/edit/:id', {
                templateUrl: 'views/edit-product.html',
                controller: 'editProductController',
                pageTitle: 'Edit Product',
                access: {
                    isFree: false
                }
            })
            .when('/button', {
                templateUrl: 'views/button.html',
                controller: 'buttonController',
                pageTitle: 'Button',
                activetab: 'button',
                access: {
                    isFree: false
                }

            })
            .when('/button/update/:id', {
                templateUrl: 'views/button.html',
                controller: 'buttonController',
                pageTitle: 'Update Button',
                access: {
                    isFree: false
                }
            })
            .when('/button/create', {
                templateUrl: 'views/button.html',
                controller: 'buttonController',
                pageTitle: 'Create Button',
                access: {
                    isFree: false
                }
            })

        .when('/error/edit/:id', {
            templateUrl: 'views/error.html',
            controller: 'errorController',
            pageTitle: 'Error',
            access: {
                isFree: true
            }
        })

        .otherwise({
            redirectTo: '/button'
        });

        /*** Analytics Confuguration ***/
        // initial configuration
        AnalyticsProvider.setAccount('UA-48995472-1');

        // track all routes (or not)
        AnalyticsProvider.trackPages(true);

        //Optional set domain (Use 'none' for testing on localhost)
        //AnalyticsProvider.setDomainName('XXX');

        // url prefix (default is empty)
        // - for example: when an app doesn't run in the root directory
        AnalyticsProvider.trackPrefix('_paywith_paytm');

        // Use analytics.js instead of ga.js
        AnalyticsProvider.useAnalytics(true);

        // Ignore first page view... helpful when using hashes and whenever your bounce rate looks obscenely low.
        AnalyticsProvider.ignoreFirstPageLoad(true);

        //Enabled eCommerce module for analytics.js
        AnalyticsProvider.useECommerce(true);

        //Enable enhanced link attribution
        AnalyticsProvider.useEnhancedLinkAttribution(true);

        //Enable analytics.js experiments
        AnalyticsProvider.setExperimentId('P13157');

        //Set custom cookie parameters for analytics.js
        AnalyticsProvider.setCookieConfig({
            cookieDomain: 'paytm.com',
            cookieName: '_paywith_paytm',
            cookieExpires: 20000
        });

        // change page event name
        AnalyticsProvider.setPageEvent('$stateChangeSuccess');



        // Intercept http calls.
        $provide.factory('payWithInterceptor', ["$q",
            function ($q) {
                return {
                    // On request success
                    request: function (config) {
                        //console.log(config); // Contains the data about the request before it is sent.

                        // Return the config or wrap it in a promise if blank.
                        return config || $q.when(config);
                    },

                    // On request failure
                    requestError: function (rejection) {
                        console.log(rejection); // Contains the data about the error on the request.

                        // Return the promise rejection.
                        return $q.reject(rejection);
                    },

                    // On response success
                    response: function (response) {
                        console.log(response.status); // Contains the data from the response.
                        if (response.status === 1) {
                            $location.path('/logout');
                        }
                        if (response.status === 132) {
                            $location.path('/logout');
                            console.log("seller does not exist");
                        }
                        // Return the response or promise.
                        return response || $q.when(response);
                    },

                    // On response failture
                    responseError: function (rejection) {
                        console.log(rejection); // Contains the data about the error.

                        // Return the promise rejection.
                        return $q.reject(rejection);
                    }
                };
        }]);

        // Add the interceptor to the $httpProvider.
        $httpProvider.interceptors.push('payWithInterceptor');

}]);


_payWithPaytm.run(['$location', '$rootScope',

    function ($location, $rootScope) {
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {

            if (current !== undefined) {
                if (current.$$route.pageTitle === undefined) {
                    $rootScope.pageTitle = "Welcome";
                } else {
                    $rootScope.pageTitle = current.$$route.pageTitle;
                }
            }


        });
}]);
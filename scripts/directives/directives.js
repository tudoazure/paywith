"use strict";
_payWithPaytm.directive("formValidation", ["productFormFactory", "config", "$cookies",
        function (productFormFactory, config, $cookies) {
        return function (scope, element, attrs) {
            scope.successFormSubmission = true;
            scope.loading = true;
            scope.productFormDiv = false;




            var submitForm = function (form) {

                var formData = new FormData();
                var cp = {};
                var darr = [];
                angular.forEach(scope.custom_params, function (data) {

                    if (darr.indexOf(data.key)) {
                        darr.push(data.key);
                        cp[data.key] = data.value;
                    }

                });
                var c_params = JSON.stringify(cp);
                formData.append("file", scope.uploadFile);
                formData.append("title", scope.title);
                formData.append("preview_img", scope.previewFile);
                formData.append("session_token", $cookies.paytm_session_key);
                formData.append("description", scope.description);
                formData.append("custom_params", c_params);
                formData.append("price", scope.price);
                formData.append("tags", "t");
                formData.append("display_tags", "true");
                formData.append("watermark_enabled", scope.watermark_enabled);
                formData.append("type", "DOCUMENTS");
                if (scope.pid) {
                    formData.append("id", scope.pid);
                    var updateUrl = config.API_HOST + appConstants.UPDATE_MERCHANDISE;
                    //loading image
                    scope.productFormDiv = true;
                    scope.loading = false;
                    productFormFactory.productFormSubmit(formData, updateUrl).success(function (response) {
                        if (response.status == 0) {
                            scope.loading = true;
                            scope.successFormSubmission = false;
                        } else {
                            console.log("status code :" + response.status);
                        }

                    });
                } else {
                    var createUrl = config.API_HOST + appConstants.CREATE_MERCHANDISE;
                    scope.productFormDiv = true;
                    scope.loading = false;
                    productFormFactory.productFormSubmit(formData, createUrl).success(function (response) {
                        if (response.status == 0) {
                            scope.loading = true;
                            scope.successFormSubmission = false;
                        } else {
                            console.log("status code :" + response.status);
                        }
                    });
                }

            };

            $(element[0]).bootstrapValidator({
                message: 'This value is not valid',
                submitHandler: function (validator, form) {

                    //console.log("submit handler called");
                    submitForm(form);

                },
                fields: {
                    title: {
                        message: 'Title is not valid',
                        validators: {
                            notEmpty: {
                                message: 'Title is required and can\'t be empty'
                            }

                        }
                    },
                    file: {
                        validators: {
                            uploadFile: {
                                message: 'Please upload a file'
                            },
                            validFileSize: {
                                maxSize: 10,
                                message: "Upload limit is 10MB"
                            }

                        }
                    },
                    preview_image: {
                        validators: {
                            validFileSize: {
                                maxSize: 2,
                                message: "Max. upload limit is 2MB"
                            }
                        }
                    },
                    price: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter some price value'
                            },
                            regexp: {
                                regexp: /^(?:[1-9]\d*|0)?(?:\.\d+)?$/,
                                message: 'Please enter a valid price'
                            }
                        }
                    },
                    description: {
                        validators: {
                            notEmpty: {
                                message: 'The description is required and can\'t be empty'
                            }

                        }
                    }



                }
            });
        }
}]);

_payWithPaytm.directive("profileFormValidation", ["profileFactory", "config", "$cookies", "$cookieStore", "$location",
        function (profileFactory, config, $cookies, $cookieStore, $location) {
        return function (scope, element, attrs) {
            scope.loading = true;
            scope.profileFormDiv = false;
            var submitProfileForm = function (form) {

                var formData = new FormData();
                console.log(scope);
                formData.append("first_name", scope.first_name);
                formData.append("middle_name", scope.middle_name);
                formData.append("last_name", scope.last_name);
                formData.append("email", scope.user_email);
                formData.append("mobile", scope.user_mobile);
                formData.append("session_token", $cookies.paytm_session_key);
                var updateUrl = config.API_HOST + appConstants.UPDATE_SELLER;
                scope.profileFormDiv = true;
                scope.loading = false;
                profileFactory.profileFormSubmit(formData, updateUrl).success(function (response) {
                    scope.loading = true;
                    scope.profileFormDiv = false;
                    $location.path("/products");
                    $cookieStore.put("paytm_user", response.data);

                });

            };
            $(element[0]).bootstrapValidator({
                message: 'This value is not valid',
                submitHandler: function (validator, form) {

                    console.log("submit handler called");
                    submitProfileForm(form);

                },
                fields: {
                    first_name: {

                        validators: {
                            notEmpty: {
                                message: 'First Name is required and can\'t be empty'
                            },
                            regexp: {
                                regexp: /^[a-zA-Z]*$/,
                                message: 'The first name can only consist of alphabets'
                            }


                        }
                    },
                    middle_name: {
                        validators: {
                            regexp: {
                                regexp: /^[a-zA-Z]*$/,
                                message: 'The middle name can only consist of alphabets'
                            }

                        }
                    },
                    last_name: {
                        validators: {
                            notEmpty: {
                                message: 'Last name is required'
                            },
                            regexp: {
                                regexp: /^[a-zA-Z]*$/,
                                message: 'The last name can only consist of alphabets'
                            }
                        }
                    },
                    user_email: {
                        validators: {
                            notEmpty: {
                                message: 'User email can not be empty'
                            },
                            emailAddress: {
                                message: 'The input is not a valid email address'
                            }

                        }
                    },
                    user_mobile: {
                        validators: {
                            notEmpty: {
                                message: 'User mobile can not be empty'
                            },
                            digits: {
                                message: 'The value can contain only digits'
                            }

                        }
                    }




                }
            });
        }
    }]);
_payWithPaytm.directive('fileModel', ['$parse',
    function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {

                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
}]);

_payWithPaytm.directive('previewImageModel', ['$parse',
    function ($parse) {

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.previewImageModel);
                var modelSetter = model.assign;

                element.bind('change', function () {

                    scope.$apply(function () {

                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
}]);
_payWithPaytm.directive('checkUser', ['$rootScope', '$location', 'authService', 'cookieService',
    function ($root, $location, authService, cookieService) {

        return {
            link: function (scope, elem, attrs, ctrl) {

                $root.$on('$routeChangeStart', function (event, current, next) {
                    scope.menuDiv = false;
                    if (cookieService.isCookieEnabled()) {
                        scope.cookieDiv = true;
                        if (!authService.isAuthenticated()) {
                            // reload the login route

                            scope.loginpage = true;


                            if (current.templateUrl == "views/login.html") {
                                scope.profileupdate = false;
                                scope.mainpage = false;
                                //scope.mainDiv = true;
                                //scope.isOtherPage = false;
                                // already going to the login route, no redirect needed
                            } else {
                                // not going to the login route, we should redirect now
                                $location.path("/login");
                            }
                        } else {
                            scope.username = authService.userName();
                            scope.isProfileComplete = authService.isProfileComplete();

                            if (scope.isProfileComplete) {
                                scope.mainDiv = false;
                                scope.mainpage = true;
                                scope.profileupdate = true;
                                scope.menuDiv = true;
                                console.log("profile is updated");
                            } else {
                                scope.loginpage = false;
                                scope.mainpage = true;
                                scope.profileupdate = true;
                                console.log("profile is not updated");

                                $location.path("/profile/update");
                            }

                            if (current.templateUrl == "views/login.html") {
                                /*
                                 * if already logged in and accessing login page then please redirect to products
                                 */
                                if (scope.isProfileComplete) {
                                    $location.path("/button");
                                } else {
                                    $location.path("/profile/update");
                                }

                            }
                        }

                    } else {
                        scope.mainDiv = true;
                        scope.menuDiv = true;
                        scope.cookieDiv = false;
                        //alert("Please enable the cookies");
                        //$location.path("/error/101");
                    }
                });
            }
        }
}]);

_payWithPaytm.directive('authUserDiv', ['$rootScope', '$location', 'authService',
    function ($root, $location, authService) {

        return {
            link: function (scope, elem, attrs, ctrl) {

                $root.$on('$routeChangeStart', function (event, current, next) {


                    if (!authService.isAuthenticated()) {
                        // reload the login route

                        scope.loginDivView = true;
                    } else {

                        scope.loginDivView = false;
                    }

                });
            }
        }
}]);

_payWithPaytm.directive("emailTextArea", ["inviteEmailFactory", "config", "$cookies",
            function (inviteEmailFactory, config, $cookies) {

        return function (scope, element, attrs) {

            var inviteEmailForm = function (form) {

                var inviteEmailData = new FormData();
                var inviteUrl = config.API_HOST + appConstants.SEND_INVITE;
                inviteEmailData.append("session_token", $cookies.paytm_session_key);
                inviteEmailData.append("id", scope.bproductid);
                inviteEmailData.append("emails", scope.inviteData);

                scope.inviteDataDiv = true;
                scope.inviteTextArea = true;
                scope.inviteProcessLoader = false;
                scope.inviteInputDesc = true;
                scope.inviteButton = true;
                inviteEmailFactory.invite(inviteEmailData, inviteUrl).success(function (response) {
                    //console.log(response);
                    scope.emailValidityAlert = "Email Sent";
                    scope.inviteProcessLoader = true;
                });
            };
            $(element[0]).bootstrapValidator({
                message: 'This value is not valid',
                submitHandler: function (validator, form) {

                    //console.log("submit handler called");
                    inviteEmailForm(form);

                },
                fields: {
                    inviteEmails: {
                        message: 'Email is not valid',
                        validators: {
                            notEmpty: {
                                message: 'Please provide list of email ids'
                            },
                            regexp: {
                                regexp: /^((\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)*([,;\ ])*)*$/,
                                message: 'Please provide valid email ids'
                            }

                        }
                    }
                }

            });

        };


    }]);

_payWithPaytm.directive("buttonFormValidation", ["buttonFactory", "config", "$cookies", "$cookieStore", "$location",
        function (buttonFactory, config, $cookies, $cookieStore, $location) {
        return function (scope, element, attrs) {

            var submitButtonForm = function (form) {
                scope.loading = true;
                scope.buttonForm = false;

                var formData = new FormData();
                console.log(scope.title);
                if (scope.title !== undefined && scope.title !== '')
                    formData.append("title", scope.title);


                if (scope.amount !== undefined && scope.amount !== '' && scope.amount > 0)
                    formData.append("amount", scope.amount);
                if (scope.notify_url !== undefined)
                    formData.append("notify_url", scope.notify_url);
                if (scope.description !== undefined)
                    formData.append("description", scope.description);
                if (scope.return_success_url !== undefined)
                    formData.append("return_success_url", scope.return_success_url);
                if (scope.return_cancel_url !== undefined)
                    formData.append("return_cancel_url", scope.return_cancel_url);
                if (scope.custom_params !== undefined)
                    formData.append("custom_params", scope.custom_params);

                formData.append("button_name", scope.button_name);

                formData.append("session_token", $cookies.paytm_session_key);
                var createUrl = config.API_HOST + appConstants.CREATE_BUTTON;
                var updateUrl = config.API_HOST + appConstants.UPDATE_BUTTON;



                if (scope.button_id) {
                    formData.append("button_id", scope.button_id);
                    buttonFactory.buttonFormSubmit(formData, updateUrl).success(function (response) {
                        console.log("button updated");
                        handleButtonResponse(response);
                    });

                } else {

                    buttonFactory.buttonFormSubmit(formData, createUrl).success(function (response) {
                        console.log("button created");
                        handleButtonResponse(response);

                    });
                }


            };

            var handleButtonResponse = function (response) {
                scope.loading = false;
                scope.buttonForm = false;
                scope.buttonScriptDiv = true;
                var title_field = "";
                var amount_field = "";
                var notify_url_field = "";
                var description_field = "";
                var return_success_url_field = "";
                var return_cancel_url_field = "";
                var button_id_field = "";
                var custom_param_field = "";
                var merchant_muoid_field = "";

                var button_id = response.data.button_id;
                var title = response.data.title;
                var amount = response.data.amount;
                var notify_url = response.data.notify_url;
                var description = response.data.description;
                var return_success_url = response.data.return_success_url;
                var return_cancel_url = response.data.return_cancel_url;
                var custom_params = response.data.custom_params;

                if (response.status == 0) {

                    if (!title)
                        title_field = " pptmdata-title=\"\"";

                    if (!amount)
                        amount_field = " pptmdata-amount=\"\"";

                    notify_url_field = " pptmdata-callback=\"" + notify_url + "\"";

                    description_field = " pptmdata-description=\"" + description + "\"";

                    if (return_success_url)
                        return_success_url_field = " pptmdata-success_url=\"" + return_success_url + "\"";

                    if (return_cancel_url)
                        return_cancel_url_field = " pptmdata-cancel_url=\"" + return_cancel_url + "\"";

                    if (!custom_params)
                        custom_param_field = " pptmdata-custom_params=\"\"";

                    merchant_muoid_field = " pptmdata-muoid=\"\"";


                    scope.button_script = "<script src=\"" + appConfig.PAY_BUTTON_URL + "?button_id=" + button_id + "\"" +
                        title_field +
                        amount_field +

                    custom_param_field +
                        merchant_muoid_field +
                        "></script>";



                }
            };
            $(element[0]).bootstrapValidator({
                message: 'This value is not valid',
                submitHandler: function (validator, form) {

                    console.log("submit handler called");
                    submitButtonForm(form);

                },
                fields: {
                    notify_url: {

                        validators: {
                            uri: {
                                message: 'The input is not a valid URL'
                            }


                        }
                    },
                    button_name: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter button name'
                            }


                        }
                    },
                    amount: {
                        validators: {
                            regexp: {
                                regexp: /^(?:[1-9][0-9]\d*|0)?(?:\.\d+)?$/,
                                message: 'Please enter a valid amount'
                            },


                        }
                    },
                    return_success_url: {
                        validators: {
                            uri: {
                                message: 'The input is not a valid URL'
                            }
                        }
                    },
                    return_cancel_url: {
                        validators: {
                            uri: {
                                message: 'The input is not a valid URL'
                            }

                        }
                    }




                }
            });
        }
            }]);
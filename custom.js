"use strict";

function __get_auth_token(param, authresponse) {

    var postData = "request_code=" + param.code + "&is_seller=" + param.is_seller + "&device_type=" + param.device_type + "&device_id=" + param.device_id + "&device_token=" + param.device_token + "&device_detail=" + param.device_detail;


    ajaxPostRequest(postData, appConstants.GET_OAUTH_TOKEN, function (data) {
        authresponse(data);

    })
}

function __update_user_details(formData) {
    console.log("update user details");
    ajaxPostRequest(formData, appConstants.UPDATE_SELLER, function (data) {
        console.log(data);
    })
}

/*
 *utility methods
 */

function ajaxPostRequest(formData, url, response) {
    $.ajax({
        url: appConfig.API_HOST + url,
        type: "POST",
        data: formData,
        processData: false, // tell jQuery not to process the data
        contentType: "application/x-www-form-urlencoded",

        success: function (responseData) {
            var oAuthData = $.parseJSON(responseData);
            response(oAuthData);
        }
    });

}

function createCookie(name, value, days) {
    
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + ";domain=." + window.location.hostname + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
/*
 * function to get url parameters
 * @parameter pid
 */
function __get_parameter_by_name(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}




function logOut() {
    eraseCookie("session_token");
    eraseCookie("dg_transaction_id");
    eraseCookie("b_transaction_id");
    eraseCookie("device_type");
}




/*
 *function to get pay product details
 *
 */
function __get_pay_prod_details(__pbid__) {

    $.ajax({
        url: appConfig.API_HOST + appConstants.GET_MERCHANDISE_INFO + __pbid__ + "/",
        type: "GET",
        processData: false, // tell jQuery not to process the data
        contentType: false,
        success: function (data) {


            var productData = $.parseJSON(data);
            console.log(productData);
            if (productData.status == 0) {
                if (productData.data.status == 'ACTIVE') {

                    var c_params = productData.data.custom_params;

                    var media = productData.data.media;

                    $("#title").val(productData.data.title);
                    $("#price").val(productData.data.amount);
                    $("#description").val(productData.data.description);
                    $("#prod_pay_details").html("<h3>" + productData.data.title + "</h3>" +
                        "<p><img src=\"" + media.preview_image + "\" class=\"img-responsive\"></p>" +
                        "<p>" + productData.data.description + "</p>" +
                        "<p>Price " + productData.data.amount + " INR</p>");

                    $.each(c_params, function (key, value) {
                        if (key != "" && key != null) {
                            intId = intId + 1;
                            var customFieldsHtml = "<p><input type=\"text\" class=\"form-control\" name=\"custom_name_" + intId + "\" id=\"custom_name_" + intId + "\" placeholder=\"" + key + "\" rel=\"" + key + "\"></p>";



                            //alert(customFieldsHtml);

                            $("#custom-forms-editable").append(customFieldsHtml);
                        }
                    });

                } else {
                    $("#sell-digital").html("<p class=\"text-center\"><h4>This product is disabled.</h4></p><p class=\"text-center\"><img src=\"" + appConfig.APP_HOST + "assets/images/disabled.jpg" + "\" class=\"img-responsive\"></p>");
                }

            } else {
                $("#sell-digital").html("<p>" + productData.message + "</p>");
            }

        }

    });
}


//device js


(function () {
    var previousDevice, _addClass, _doc_element, _find, _handleOrientation, _hasClass, _orientation_event, _removeClass, _supports_orientation, _user_agent;

    previousDevice = window.device;

    window.device = {};

    _doc_element = window.document.documentElement;

    _user_agent = window.navigator.userAgent.toLowerCase();

    device.ios = function () {
        return device.iphone() || device.ipod() || device.ipad();
    };

    device.iphone = function () {
        return _find('iphone');
    };

    device.ipod = function () {
        return _find('ipod');
    };

    device.ipad = function () {
        return _find('ipad');
    };

    device.android = function () {
        return _find('android');
    };

    device.androidPhone = function () {
        return device.android() && _find('mobile');
    };

    device.androidTablet = function () {
        return device.android() && !_find('mobile');
    };

    device.blackberry = function () {
        return _find('blackberry') || _find('bb10') || _find('rim');
    };

    device.blackberryPhone = function () {
        return device.blackberry() && !_find('tablet');
    };

    device.blackberryTablet = function () {
        return device.blackberry() && _find('tablet');
    };

    device.windows = function () {
        return _find('windows');
    };

    device.windowsPhone = function () {
        return device.windows() && _find('phone');
    };

    device.windowsTablet = function () {
        return device.windows() && _find('touch');
    };

    device.fxos = function () {
        return (_find('(mobile;') || _find('(tablet;')) && _find('; rv:');
    };

    device.fxosPhone = function () {
        return device.fxos() && _find('mobile');
    };

    device.fxosTablet = function () {
        return device.fxos() && _find('tablet');
    };

    device.meego = function () {
        return _find('meego');
    };

    device.mobile = function () {
        return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego();
    };

    device.tablet = function () {
        return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
    };

    device.portrait = function () {
        return Math.abs(window.orientation) !== 90;
    };

    device.landscape = function () {
        return Math.abs(window.orientation) === 90;
    };

    device.noConflict = function () {
        window.device = previousDevice;
        return this;
    };

    _find = function (needle) {
        return _user_agent.indexOf(needle) !== -1;
    };

    _hasClass = function (class_name) {
        var regex;
        regex = new RegExp(class_name, 'i');
        return _doc_element.className.match(regex);
    };

    _addClass = function (class_name) {
        if (!_hasClass(class_name)) {
            return _doc_element.className += " " + class_name;
        }
    };

    _removeClass = function (class_name) {
        if (_hasClass(class_name)) {
            return _doc_element.className = _doc_element.className.replace(class_name, "");
        }
    };

    if (device.ios()) {
        if (device.ipad()) {
            _addClass("ios ipad tablet");
        } else if (device.iphone()) {
            _addClass("ios iphone mobile");
        } else if (device.ipod()) {
            _addClass("ios ipod mobile");
        }
    } else if (device.android()) {
        if (device.androidTablet()) {
            _addClass("android tablet");
        } else {
            _addClass("android mobile");
        }
    } else if (device.blackberry()) {
        if (device.blackberryTablet()) {
            _addClass("blackberry tablet");
        } else {
            _addClass("blackberry mobile");
        }
    } else if (device.windows()) {
        if (device.windowsTablet()) {
            _addClass("windows tablet");
        } else if (device.windowsPhone()) {
            _addClass("windows mobile");
        } else {
            _addClass("desktop");
        }
    } else if (device.fxos()) {
        if (device.fxosTablet()) {
            _addClass("fxos tablet");
        } else {
            _addClass("fxos mobile");
        }
    } else if (device.meego()) {
        _addClass("meego mobile");
    } else {
        _addClass("desktop");
    }

    _handleOrientation = function () {
        if (device.landscape()) {
            _removeClass("portrait");
            return _addClass("landscape");
        } else {
            _removeClass("landscape");
            return _addClass("portrait");
        }
    };

    _supports_orientation = "onorientationchange" in window;

    _orientation_event = _supports_orientation ? "orientationchange" : "resize";

    if (window.addEventListener) {
        window.addEventListener(_orientation_event, _handleOrientation, false);
    } else if (window.attachEvent) {
        window.attachEvent(_orientation_event, _handleOrientation);
    } else {
        window[_orientation_event] = _handleOrientation;
    }

    _handleOrientation();

}).call(this);
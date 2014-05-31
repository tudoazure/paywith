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
 //New Code start
 function changeView(view){
 	document.getElementById("viewContainer").innerHTML = "";
 	document.getElementById("viewContainer").appendChild(view);
 };

 function showError(elId, message){
 	document.getElementById(elId).classList.add = 'error';
	var errorDiv = document.getElementById(elId+'-error');
	errorDiv.style.display = 'inline';
	errorDiv.innerHTML = message;
 };

 function hideError(elId, message){
 	document.getElementById(elId).classList.remove = 'error';
	var errorDiv = document.getElementById(elId+'-error');
	errorDiv.style.display = 'none';
	errorDiv.innerHTML = "";
 };

 function loginFormValidate(){
 	var xmlhttp;
 	var loginForm = document.getElementById('loginForm');
 	if(loginForm){
 		var username = document.getElementById('username').value;
 		var password = document.getElementById('password').value;
 		if(username && password){
 			login('',username, password);
 		}
 	}

 };

 function loginCallback(xmlhttp){
 	if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
 		var response = JSON.parse(xmlhttp.responseText);
 		if(response.status == 0 && response.message.toLowerCase() == 'success'){
	 		createCookie("paytm_session_key", response.data.session.access_token, 10); 
	        createCookie("ses_user", response.data.user.username, 10);
	        createCookie("paytm_user", JSON.stringify(response.data.user), 10);
 			alert('success');
 		}else{
 			showError('username',response.message);
 		}
    }else{
    	console.log(xmlhttp.readyState)
    }
 };

 function login(url, username, password){
 	var xmlhttp;
 	if(username && password){
	 	xmlhttp=new XMLHttpRequest();
	 	if(!url){
	 		var url = "https://paywith.paytm.com/api/core/seller/get-oauth-token-using-password/";
	 	}
		xmlhttp.onreadystatechange = function()
		{
			loginCallback(xmlhttp);
		};
		xmlhttp.open("POST",url,true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("username="+username+"&device_token=web-token&is_seller=true&device_type=web&device_detail=["+navigator.userAgent+"]&password="+password+"&device_id=dev-id");
		//xmlhttp.send("username=bhupesh00gupta@gmail.com&device_token=token&is_seller=true&device_type=web&device_detail=User-Agent&password=Cssgrgt98oer&device_id=dev-id");
	}
 };

 function signupCallback(xmlhttp){
 	if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
 		var response = JSON.parse(xmlhttp.responseText);
 		if(response.status == 0 && response.message.toLowerCase() == 'success'){
 			if(response.data){
 				var username = response.data.email;
 				var password = response.data.code;
 				var loginUrl = "https://paywith.paytm.com/api/core/seller/login-api-with-request-code/"
 				login(loginUrl, username, password);
 			}
 		}else{
 			showError('emailId',response.message)
 		}
 	}
 };

 function forgetPwdCallback (argument) {
 	if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
 		var response = JSON.parse(xmlhttp.responseText);
 		if(response.status == 0 && response.message.toLowerCase() == 'success'){
 			alert('mail sent');
 		}else{
 			showError('username',response.message)
 		}
 	}
 };

 function signUp(){
 	var xmlhttp;
 	var signupForm = document.getElementById('signForm');
 	if(signupForm){
 		var mobileNumber = document.getElementById('mobileNumber').value;
 		var emailId = document.getElementById('emailId').value;
 		var password = document.getElementById('password').value;
 		if(mobileNumber && emailId && password){
 			xmlhttp=new XMLHttpRequest();
 			xmlhttp.onreadystatechange = function(){
 				signupCallback(xmlhttp);
 			}
 			var url = "https://paywith.paytm.com/api/core/seller/register-user/"
 			xmlhttp.open("POST",url,true);
 			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
 			xmlhttp.send("mobileNumber="+mobileNumber+"&password="+password+"&email="+emailId);
 		}
 	}

 };

 function getPassword(){
 	var xmlhttp;
 	var forgetPwdForm = document.getElementById('forgetPwdForm');
 	if(forgetPwdForm){
 		var username = document.getElementById('username').value;
 		if(username){
 			xmlhttp=new XMLHttpRequest();
 			xmlhttp.onreadystatechange = function(){
 				forgetPwdCallback(xmlhttp);
 			}
 			var url = "https://paywith.paytm.com/api/oauth-api/forgetPass"; 
 			xmlhttp.open("POST",url,true);
 			xmlhttp.setRequestHeader("Content-type","application/json");
 			xmlhttp.send(JSON.stringify({"email":username}));
 		}else{
 			showError('username', 'Please enter your email')
 		}
 	}
 };

 function showforgetPwdForm(){
 	var div = document.createElement('div');
 	div.id = "forgetPwdForm";
 	div.className ="form-group";
 	div.innerHTML = "<input type='text' name='username' id='username' class='form-control field' placeholder='Enter your Email' />\
 		<div class='msg mL10'><span id='username-error' class='error'></span></div>\
 		<input type='submit' class='btn btn-primary field form-control' onclick='getPassword()' value='Get Password'/>\
 		<div class='width95 field' align = 'center'><span> We will send a link on your registered email </span></div> ";
 	changeView(div);
 };

 function showLogInForm(){
 	var div = document.createElement('div');
 	div.id = "loginForm";
 	div.className ="form-group";
 	div.innerHTML = "<input type='text' name='username' id='username' class='form-control field' placeholder='Enter your Mobile or Email' />\
 		<div class='msg mL10'><span id='username-error' class='error'></span></div>\
 		<input type='password' name='password' id='password' class='form-control field' placeholder = 'Paytm Password'/>\
 		<div class='msg mL10'><span id='password-error' class='error'></span></div>\
 		<div class='width95 field' align = 'center'> <a href='#' onclick='showforgetPwdForm()'> Forget Password ?</a></div>\
 		<input type='submit' class='btn btn-primary field form-control' onclick='loginFormValidate()' value='Secure Sign In'/>\
 		<div class='width95 field' align = 'center'><span> Don't have an account? <a href='#' onclick='showSignUpForm()'> Singn Up</a></span></div> ";
 	changeView(div);
 };

 function showSignUpForm(){
 	var div = document.createElement('div');
 	div.id = "signForm";
 	div.className ="form-group";
 	div.innerHTML = "<input type='text' name='username' id='mobileNumber' class='form-control field' placeholder='Enter your Mobile Number' />\
 		<div class='msg mL10'><span id='mobileNumber-error' class='error'></span></div>\
 		<input type='text' id='emailId' class='form-control field' placeholder='Enter your Email ID' />\
 		<div class='msg mL10'><span id='emailId-error' class='error'></span></div>\
 		<input type='password' name='password' id='password' class='form-control field' placeholder = 'Create your Paytm Password'/>\
 		<div class='msg mL10'><span id='password-error' class='error'></span></div>\
 		<input type='submit' class='btn btn-primary field form-control' onclick='signUp()' value='Create Account'/>\
 		<div class='width95 field' align = 'center'><span> Already have an account? <a href='#' onclick='showLogInForm()'> Singn In</a></span></div> ";
 	changeView(div);
 };

 function checkLogIn(){
 	var session_cookie = readCookie("paytm_session_key");
 	return session_cookie;
 };

 function signUpSignInLinksHtml(){
 	if(!checkLogIn()){
 		var div = document.createElement('div');
 		div.className = 'signButton';
 		div.innerHTML = "<input type='button' class='btn btn-primary mL10' name='SignIn' value='Sign In' onclick = 'showLogInForm()'/>\
 		<input type='button' name='SignUP' class='btn btn-primary mL10' value='Sign UP' onclick = 'showSignUpForm()'/>";
 		return div;
 	}
 	return "";
 };

function getProductHtml (productData){
	var maincontainer = document.getElementById("sell-digital");
	console.log(productData);
            if (productData.status == 0) {
                if (productData.data.status == 'ACTIVE') {
                    var c_params = productData.data.custom_params;
                    var media = productData.data.media;
                    var productHtml = "<div class='product-img-container' style='background-image: url("+media.preview_image+")'>\
                            <h3 class='product-title'>"+ productData.data.title + "</h3>\
                            <span class='product-desc'>" + productData.data.description + "</span>\
                            <span class='product-price'>" +  productData.data.amount + " INR</span>\
                        </div>";
                     var productDiv = document.getElementById('prod_pay_details');
                     productDiv.className = 'mB20';
                     productDiv.innerHTML = productHtml;
                    

                    $.each(c_params, function (key, value) {
                        if (key != "" && key != null) {
                            intId = intId + 1;
                            var p = document.createElement("p");
                            var input = document.createElement("input");
                            input.type = "text";
                            input.className = "form-control";
                            input.name = "custom_name_" + intId;
                            input.id = "custom_name_" + intId;
                            input.placeholder = key;
                            input.rel = key;
                            p.appendChild(input);
                            // var customFieldsHtml = "<p><input type='text' class='form-control' name='custom_name_" + intId + "' id='custom_name_" + intId + "' placeholder='" + key + "' rel='" + key + "'></p>";

                            document.getElementById("custom-forms-editable").appendChild(p);
                        }
                    });
					//code for showing SignUP and SignIn Button
					var buttonDiv = signUpSignInLinksHtml();
					if(buttonDiv){
						document.getElementById("custom-forms-editable").appendChild(buttonDiv);
					}

                } else {
                    maincontainer.innerHTML = "<p class=\"text-center\"><h4>This product is disabled.</h4></p><p class=\"text-center\"><img src=\"" + appConfig.APP_HOST + "assets/images/disabled.jpg" + "\" class=\"img-responsive\"></p>";
                }

            } else {
                maincontainer.innerHTML = "<p>" + productData.message + "</p>";
            }
};
//New Code End

function __get_pay_prod_details(__pbid__) {

    $.ajax({
        url: appConfig.API_HOST + appConstants.GET_MERCHANDISE_INFO + __pbid__ + "/",
        type: "GET",
        processData: false, // tell jQuery not to process the data
        contentType: false,
        success: function (data) {
            var productData = $.parseJSON(data);
            getProductHtml(productData);
        },
        error: function(error){
        	var response = '{"status": 0, "message": "Success", "data": {"status": "ACTIVE", "custom_params": {}, "description": "The go-to book for the modern designer, starting at the basics and taking you right the way through to being able to create stunning iconography.", "title": "The Icon Handbook", "merchandise_type": "", "media": {"preview_thumb": "", "preview_image": "https://s3.amazonaws.com/pwppub/preview/cf199f3e58"}, "created_on": 1401124613912, "max_downloads": 5, "watermark_enabled": true, "payee": 31, "amount": 1.00, "display_tags": true, "extra_params": {}, "updated_on": 1401297934123, "button_id": "bafbab7cb4"}, "extra": {}}'
        	var productData = $.parseJSON(response);
        	getProductHtml(productData);
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

"use strict";

function __get_auth_token(param, authresponse) {

    var postData = "request_code=" + param.code + "&is_seller=" + param.is_seller + "&device_type=" + param.device_type + "&device_id=" + param.device_id + "&device_token=" + param.device_token + "&device_detail=" + param.device_detail;

    ajaxPostRequest(postData, appConstants.GET_OAUTH_TOKEN, function (data) {
        authresponse(data);

    })
};

function __update_user_details(formData) {
    console.log("update user details");
    ajaxPostRequest(formData, appConstants.UPDATE_SELLER, function (data) {
        console.log(data);
    })
};

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

};

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
    eraseCookie("dg_transaction_id");
    eraseCookie("paytm_session_key");
    eraseCookie("paytm_user");
    eraseCookie("ses_user");
    showFirstPage();
}


/*
 *function to get pay product details
 *
 */
 //New Code start
// paytm_session_key ='', ses_user = '', paytm_user ='';

function showFirstPage(){
    document.getElementById("view").innerHTML = "";
    document.getElementById("custom-forms-editable").style.display = 'inline'
};

 function changeView(view){
 	document.getElementById("view").innerHTML = "";
 	document.getElementById("view").appendChild(view);
    document.getElementById("custom-forms-editable").style.display = 'none'
 };

 function showError(elId, message){
 	document.getElementById(elId).classList.add('error');
	var errorDiv = document.getElementById(elId+'-error');
	errorDiv.style.display = 'inline';
	errorDiv.innerHTML = message;
 };

 function hideError(elId, message){
 	document.getElementById(elId).classList.remove('error');
	var errorDiv = document.getElementById(elId+'-error');
	errorDiv.style.display = 'none';
	errorDiv.innerHTML = "";
 };

 function hideAllError(form){
    if(form){
        var spans = form.getElementsByTagName('span');
        var inputs = form.getElementsByTagName('input');
        if(spans.length){
            for(var i=0; i<spans.length; i++){
                if(spans[i].classList.contains('error')){
                    spans[i].style.display = 'none';
                }
            }
        }
        if(inputs.length){
            for(var i=0; i<inputs.length; i++){
                if(inputs[i].classList.contains('error')    ){
                    inputs[i].classList.remove('error');
                }
            }
        }
    }
 }

 function loginFormValidate(){
 	var xmlhttp;
 	var loginForm = document.getElementById('loginForm');
    hideAllError(loginForm);
 	if(loginForm){
 		var username = document.getElementById('username').value;
 		var password = document.getElementById('password').value;
 		if(username && password){
 			login('',username, password);
 		}else{
            if(!username){
                showError('username', "Please enter your email.");
            }
            if(!password){
                showError('password', "Please enter your password.");
            }
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
            //to be removed
            window.paytm_session_key = response.data.session.access_token;
            window.ses_user = response.data.user.username;
            window.paytm_user = JSON.stringify(response.data.user);
            getWalletBalance(true);
        }else{
            showError('username',response.message);
        }
    }
 };

 function login(url, username, password, isSignup){
 	var xmlhttp;
 	if(username && password){
	 	xmlhttp=new XMLHttpRequest();
	 	if(!url){
	 		var url = appConfig.API_HOST + appConstants.USER_LOGIN;
	 	}
		xmlhttp.onreadystatechange = function()
		{
			loginCallback(xmlhttp);
		};
		xmlhttp.open("POST",url,true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        if(isSignup){
           xmlhttp.send("device_token=web-token&is_seller=true&device_type=web&device_detail=["+navigator.userAgent+"]&request_code="+password+"&device_id=dev-id"); 
       }else{
            xmlhttp.send("username="+username+"&device_token=web-token&is_seller=true&device_type=web&device_detail=["+navigator.userAgent+"]&password="+password+"&device_id=dev-id");
       }
	}
 };

 function signupCallback(xmlhttp){
 	if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
 		var response = JSON.parse(xmlhttp.responseText);
 		if(response.status == 0 && response.message.toLowerCase() == 'success'){
 			if(response.data){
 				var username = response.data.email;
 				var password = response.data.code;
 				var loginUrl = appConfig.API_HOST + appConstants.GET_OAUTH_TOKEN;
 				login(loginUrl, username, password, true);
 			}
 		}else{
 			showError('emailId',response.message)
 		}
 	}
 };

 function forgetPwdCallback (xmlhttp) {
 	if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
 		var response = JSON.parse(xmlhttp.responseText);
 		if(response.status == 0 && response.message.toLowerCase() == 'success'){
 			console.log('mail sent');
 		}else{
 			showError('username',response.message)
 		}
 	}
 };

 function signUp(){
 	var xmlhttp;
 	var signupForm = document.getElementById('signForm');
    hideAllError(signupForm);
 	if(signupForm){
 		var mobileNumber = document.getElementById('mobileNumber').value;
 		var emailId = document.getElementById('emailId').value;
 		var password = document.getElementById('password').value;
 		if(mobileNumber && emailId && password){
 			xmlhttp=new XMLHttpRequest();
 			xmlhttp.onreadystatechange = function(){
 				signupCallback(xmlhttp);
 			}
 			var url = appConfig.API_HOST + appConstants.USER_SIGNUP;
 			xmlhttp.open("POST",url,true);
 			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
 			xmlhttp.send("mobileNumber="+mobileNumber+"&password="+password+"&email="+emailId);
 		}else{
            if(!mobileNumber){
                showError('mobileNumber','Please enter your mbile number');
            }
            if(!emailId){
                showError('emailId','Please enter your email');
            }
            if(!password){
                showError('password','Please enter your password');
            }
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
 			var url = appConfig.API_HOST +  appConstants.USER_FORGOT_PASSWORD;
 			xmlhttp.open("POST",url,true);
 			xmlhttp.setRequestHeader("Content-type",false);
 			xmlhttp.send(JSON.stringify({"email":username}));
 		}else{
 			showError('username', 'Please enter your email')
 		}
 	}
 };

 function getWalletBalance(async){
    var token = window.paytm_session_key;//readCookie("paytm_session_key");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        walletBalanceCallback(xmlhttp);
    }
    var url = appConfig.API_HOST + appConstants.USER_WALLET_BALANCE;
    xmlhttp.open("POST",url,async);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("session_token="+token);
 };

  function walletBalanceCallback(xmlhttp){
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
        var response = JSON.parse(xmlhttp.responseText);
        if(response.status == 0 && response.message.toLowerCase() == 'success'){
            if(response.data){
                var balance = parseInt(response.data.amount,10);
                openWalletForm(balance);
            }
        }else{
            console.log(response.message);
        }
    }
 };

 function openWalletForm(balance){
    var price = document.getElementById('product-price').innerHTML.trim();
    var paytm_user = window.paytm_user;//readCookie("paytm_user")
    paytm_user =  JSON.parse(paytm_user);
    var username =  paytm_user.first_name ? paytm_user.first_name + paytm_user.last_name : paytm_user.email;
    var div = document.createElement('div');
    div.id = "walletForm";
    div.className ="form-group";
    div.innerHTML = "<div class='span6 header'>\
                        <div class='span3 padd fl'><span class='fb f12'>"+username+"</span><br/><a class='logout' href='#', onclick='logOut()'>Logout</a></div>\
                        <div class='fr padd1'>\
                            <span>Balance</span>\
                            <div class='wallet-balance'><span class='WebRupee'>&#x20B9;</span> <span id='wb-balance'>" +  balance + "</span></div>\
                        </div>\
                    </div>\
        <div class='width95 mt10 clear' align = 'center'><span>Continue with your payment</span></div>\
        <input type='submit' class='btn btn-primary field form-control' onclick='_pay_now_submit()' value='Pay "+price+"'/>";
    changeView(div);
 }

 function showforgetPwdForm(){
 	var div = document.createElement('div');
 	div.id = "forgetPwdForm";
 	div.className ="form-group";
 	div.innerHTML = "<div align='center' class='heading'>Pay with Paytm</div>\
        <input type='text' name='username' id='username' class='form-control field' placeholder='Enter your Email' />\
 		<div class='msg label1'><span id='username-error' class='error'></span></div>\
 		<input type='submit' class='btn btn-primary field form-control' onclick='getPassword()' value='Submit'/>\
 		<div class='width95 mt10' align = 'center'><span class='gry-6'> We will send a link on your registered email </span></div>\
        <div class='width95 mt10' align = 'center'><a href='#' onclick='showLogInForm()'> Sign In </a></div>";

 	changeView(div);
 };

 function showLogInForm(){
 	var div = document.createElement('div');
 	div.id = "loginForm";
 	div.className ="form-group";
 	div.innerHTML = "<div align='center' class='heading'>Pay with Paytm</div>\
        <label class='label1'>Email</label>\
        <input type='text' name='username' id='username' class='form-control field' placeholder='Enter your Email' />\
 		<div class='msg label1'><span id='username-error' class='error'></span></div>\
        <label class='label1'>Password</label>\
 		<input type='password' name='password' id='password' class='form-control field' placeholder = 'Paytm Password'/>\
 		<div class='msg label1'><span id='password-error' class='error'></span></div>\
 		<div class='width95 mt10 mb10' align = 'center'> <a href='#' onclick='showforgetPwdForm()'> Forget Password?</a></div>\
 		<input type='submit' class='btn btn-primary field form-control' onclick='loginFormValidate()' value='Sign In'/>\
 		<div class='width95' align = 'center'><span class='gry-6'> Don't have an account? <a href='#' onclick='showSignUpForm()'> Sign Up</a></span></div> ";
 	changeView(div);
 };

 function showSignUpForm(){
 	var div = document.createElement('div');
 	div.id = "signForm";
 	div.className ="form-group";
 	div.innerHTML = "<div align='center' class='heading'>Pay with Paytm</div>\
        <label class='label1'>Mobile Number</label>\
        <input type='text' name='username' id='mobileNumber' class='form-control field' placeholder='Enter your Mobile Number' />\
 		<div class='msg label1'><span id='mobileNumber-error' class='error'></span></div>\
        <label class='label1'>Email</label>\
 		<input type='text' id='emailId' class='form-control field' placeholder='Enter your Email ID' />\
 		<div class='msg label1'><span id='emailId-error' class='error'></span></div>\
        <label class='label1'>Password</label>\
 		<input type='password' name='password' id='password' class='form-control field' placeholder = 'Create your Paytm Password'/>\
 		<div class='msg label1'><span id='password-error' class='error'></span></div>\
 		<input type='submit' class='btn btn-primary field form-control' onclick='signUp()' value='Create Account'/>\
 		<div class='width95' align = 'center'><span class='gry-6'> Already have an account? <a href='#' onclick='showLogInForm()'> Sign In</a></span></div> ";
 	changeView(div);
 };

 function checkLogIn(){
 	var session_cookie = readCookie("paytm_session_key");
 	return session_cookie;
 };

 function signUpSignInLinksHtml(){
 		var div = document.createElement('div');
 		div.className = 'signup-nav';
        div.innerHTML = '<div class="signup-text" align="center">To continue, you need an account!</div>\
                        <ul class="menu-nav">\
                            <li class="active" onclick="showLogInForm()"><a>Sign In</a></li>\
                            <li onclick="showSignUpForm()"><a>Sign Up</a></li>\
                        </ul>';
 		return div;
 	
 };

function getProductHtml (productData){
	var maincontainer = document.getElementById("sell-digital");
    if (productData.status == 0) {
        if (productData.data.status == 'ACTIVE') {
            var c_params = productData.data.custom_params;
            var media = productData.data.media;
            var productHtml = "<div class='product-img-container' style='background-image: url("+media.preview_image+")'>\
                    <div class='paytm-logo-right'></div>\
                    <h3 class='product-title'>"+ productData.data.title + "</h3>\
                    <span class='product-desc'>" + productData.data.description + "</span>\
                    <div class='product-price'><span class='WebRupee'>&#x20B9;</span> <span id='product-price'>" +  productData.data.amount + "</span></div>\
                </div>";
            var productDiv = document.getElementById('prod_pay_details');
            productDiv.innerHTML = productHtml;
            $.each(c_params, function (key, value) {
                if (key != "" && key != null) {
                    intId = intId + 1;
                    var input = document.createElement("input");
                    input.type = "text";
                    input.className = "form-control field";
                    input.name = "custom_name_" + intId;
                    input.id = "custom_name_" + intId;
                    input.placeholder = key;
                    input.rel = key;
                    document.getElementById("custom-forms-editable").appendChild(input);
                }
            });
            if(checkLogIn()){
                getWalletBalance(false);
            }
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

function _pay_now_submit() {
    var div = document.getElementById('custom-forms-editable');
    var $inputs = div.getElementsByTagName('input');
    console.log($inputs);
    var user = window.paytm_user;//readCookie('paytm_user') // todo need to change
    if(user){
        user = JSON.parse(user);
    }
    var email = user.email;
    var values = {};
    var c_name = {};
    var c_desc = {};
    var cp = {};
    for(var i= 0 ; i< $inputs.length ; i++){
       if ($inputs[i].name != "d_email" && $inputs[i].name != "title" && 
           $inputs[i].name != "description" && $inputs[i].name != "price" && 
           $inputs[i].name != "currency" && $inputs[i].name != "") 
       {
            values[$inputs[i].name] = $inputs[i].value;
            cp[$inputs[i].rel] = $inputs[i].value;
        } 
    }
    var c_params = JSON.stringify(cp);
    document.getElementById("view").innerHTML = "";
    document.getElementById("view").innerHTML = "<div class='text-center'>\
                                                    <img src='"+appConfig.APP_HOST+"assets/images/spinner-md.gif'>\
                                                </div>";
    var session_token = readCookie("paytm_session_key");
    var device_type = 'desktop-browser';
    // if(device.mobile()){
    //     device_type = 'mobile-browser';
    // }

    // Why
    eraseCookie("transaction_id");

    var formData = new FormData();
    formData.append("id", pbid);
    formData.append("d_email", email);
    formData.append("custom_params", c_params);
    formData.append("device_type", device_type);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        checkoutCB(request);
    }
    request.open("POST", appConfig.API_HOST + appConstants.START_TRANSACTION);
    request.send(formData);
};

function checkoutCB(request){
    if (request.readyState == 4 && request.status == 200){
        var txnResponse = JSON.parse(request.responseText);
        if(txnResponse.status == 0){
            console.log("transaction successful" + txnResponse.data.transaction_id);
            createCookie("dg_transaction_id", txnResponse.data.transaction_id);
            __finish_transaction(txnResponse.data.transaction_id);
        }
        else {
            if(txnResponse.status === 121){
                document.getElementById("view").innerHTML = "<p class=\"text-center\"><h4>This product is disabled.</h4></p><p class=\"text-center\"><img src=\"" + appConfig.APP_HOST + "assets/images/disabled.jpg" + "\" class=\"img-responsive\"></p>";
            } else {
                document.getElementById("view").innerHTML ="<p>"+txnResponse.message+ "</p>";
            }
        }
    }else{
        console.log(request.readyState)
    }
};

function __finish_transaction(transaction_id){
    var session_cookie = window.paytm_session_key;//readCookie("paytm_session_key");//todo need to change
     var session_cookie = window.paytm_session_key;//readCookie("paytm_session_key");//todo need to change
    if (session_cookie == null) {
        showLogInForm();
    } 
    else {
        var device_type = 'desktop-browser'; 
        // if(device.mobile()){ device_type = 'mobile-browser'; } //todo need to change
        var formData = new FormData();
        //var transaction_id = readCookie("dg_transaction_id");//to do need to check
        formData.append("transaction_id", transaction_id);
        formData.append("session_token", session_cookie);
        formData.append("device_type", device_type);
        var request = new XMLHttpRequest();
        request.onreadystatechange = function(){
            openPGPage(request);
        }
        request.open("POST", appConfig.API_HOST + appConstants.FINISH_TRANSACTION);
        request.send(formData);
    }
};

function openPGPage(request){
    if (request.readyState == 4 && request.status == 200){
        var txnResponse = JSON.parse(request.responseText);
        if(txnResponse.status == 0){
            document.getElementById("view").innerHTML = "<div class=\"span6 text-center\"><p>Thank you for your purchase. A link to the file has been emailed to you.</p></div>";
        }
        else if(txnResponse.status == 1001){
            var form_data = txnResponse.data.html_form;
            var ifrm = document.createElement("IFRAME");
            ifrm.name = 'myiframe';
            ifrm.id = 'myiframe';
            ifrm.style.width = 100 +"%";
            ifrm.style.height = 100 +"%";
            
            document.getElementById('view').innerHTML = form_data;
            document.getElementById('view').appendChild(ifrm);
            var form = document.getElementsByTagName('form');
            form[0].target = ifrm.name;
            var script = document.getElementById('view').getElementsByTagName('script');
            if(script){
                eval(script[0].text);
            }

            // document.getElementById('view').appendChild(form_data);  
             // $("#view").html(form_data);
        } else {
            console.log("transaction failed");
            if(txnResponse.message){
               document.getElementById("view").innerHTML = "<p>"+txnResponse.message+ "</p>"; 
           }else{
                document.getElementById("view").innerHTML = "<div class=\"span6 text-center\"><p>Thank you for your purchase. A link to the file has been emailed to you.</p></div>";
           }
        }
    }else{
        console.log(request.readyState)
    }
}


function getProductDetails(pbid){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function(){
        getProductDetailsCB(xmlHttp);
    }
    var url = appConfig.API_HOST + appConstants.GET_MERCHANDISE_INFO + pbid + "/";
    xmlHttp.open("GET", url,false);
    xmlHttp.send(null);
}

 function getProductDetailsCB(xmlHttp){
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
        var productData = JSON.parse(xmlHttp.responseText);
        getProductHtml(productData);
    }
 };

//New Code End


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
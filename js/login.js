var connection;
var username;
var adminUser = "Admin";

function handleConnect() {

	username = document.getElementById("username").value;
	
	sessionStorage.setItem("clientId", username);
	
	if (username == adminUser) {
		window.open("http://localhost:8001/demo/jms/SportsBook/admin.html");
	} else {
		window.open("http://localhost:8001/demo/jms/SportsBook/KaazingSports.html");
	}
	
	document.getElementById("username").value = "";
	document.getElementById("password").value = "";
}
         
function handleException(e) {
	alert("<span class='error'>EXCEPTION: " + e+"</span>");
}

function setup() {
	username = document.getElementById("username");
    password = document.getElementById("password");
}

function setupSSO(webSocketFactory) {
    /* Respond to authentication challenges with popup login dialog */
    var basicHandler = new BasicChallengeHandler();
    basicHandler.loginHandler = function(callback) {
        popupLoginDialog(callback);
    }
    webSocketFactory.setChallengeHandler(basicHandler);
}


function popupLoginDialog(callback) {
    //popup dialog to get credentials
    var popup = document.getElementById("sso_logindiv");
    popup.style.display = "block";
    var login = document.getElementById("sso_login");
    var cancel = document.getElementById("sso_cancel");

    //"OK" button was clicked, invoke callback function with credential to login
    login.onclick = function() {
        var username = document.getElementById("sso_username");
        var password = document.getElementById("sso_password");
        var credentials = new PasswordAuthentication(username.value, password.value);
        //clear user input
        username.value = "";
        password.value = "";
        //hide popup
        popup.style.display = "none";
        callback(credentials);
    }
    //"Cancel" button has been clicked, invoke callback function with null argument to cancel login
    cancel.onclick = function() {
        var username = document.getElementById("sso_username");
        var password = document.getElementById("sso_password");
        //clear user input
        username.value = "";
        password.value = "";
        //hide popup
        popup.style.display = "none";
        callback(null);
    }
}
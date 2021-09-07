//
// start modules-libraries
//
const app = require("express")();
const fetch = require("node-fetch");
const http = require('http');
const fs = require('fs');
const path = require('path');
//
// end modules-libraries
//
// start global constants
//
const webhostname = 'AA.BB.CC.DDD';
const clientmachine = 'http://ZZ.YY.XX.WWW:8080';
const web_port = 8080;
const app_port = 3000;
const gsNO_REQUEST = "/";
const appGET_STATUS = "/status";
const appPX = "/px";
const appPX_LOGIN = "/pxlogin";
const appPX_OTP = "/pxotp";
const appPX_GUILDS = "/pxguilds";
const appPX_CONFIG = "/pxconfig";
const gsDEV_SERVICE = "https://internaldevelopment.server.com/servers";
const gsGET_DEV_STATUS = "/servers?server_id="; // required: realmid
const gsFETCH_FROM_SERVER = "https://url-to-fetch-from.com";
//
// end global constants
//
// start app settings
//
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true })); 
//
// end app settings
//
// start utility functions
//
function doDate() {
  var d = new Date(),
  minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
  hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
  ampm = d.getHours() >= 12 ? 'PM' : 'AM',
  months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return (d.getFullYear()+months[d.getMonth()]+d.getDate()+'|'+hours+':'+minutes);
};

function doLog(paramLogEntry) {
	var timedate = "XXXXXXXXXXXXXXX";
	timedate = doDate();
	console.log(doDate()+"["+paramLogEntry+"]");
};
//
// end utility functions
//
// start web and app startup commands
//
http.createServer(function(req, res) {
	//var neededstats = [];
    	if (req.url == '/index.html' || req.url == '/') {
        	fs.readFile('./index.html', function(err, data) {
            		res.end(data);
        	});
    	} else {
        	var pathname = __dirname + '/' + url.parse(req.url).pathname;
        	fs.readFile(pathname, function(err, data) {
            		res.end(data);
        	});
    	};
	doLog(`web request: `+req.url);
}).listen(web_port, webhostname);
doLog(`web server running at http://${webhostname}:${web_port}/`);

app.listen(app_port, () => {
 doLog(`express app server running at http://${webhostname}:${app_port}/`);
});
//
// end web and app startup commands
//
// start app events
//
//	DETERMINE TEST
//
// login is POST, other tests are GET
//
app.post(appPX, async function(req, res) {
	// incoming POST from form, redirect to test
	var testtype = req.body.test;
	doLog(`incoming request:`+req.body.test+` redirecting...`);

	if (testtype == appPX_LOGIN.prototype.substring(1,appPX_LOGIN.length))
		res.redirect(307, appPX_LOGIN);
	else
		res.redirect(307, '/');
});
//
//	TEST LOGIN
//
app.post(appPX_LOGIN, async function(req, res) {
	doLog('login username='+req.body.testusername);
	doLog('login password='+req.body.testpassword);
	doLog('login deviceid='+req.body.testdeviceid);
  	var pxLogin = "";
	pxLogin = await fetch(gsFETCH_FROM_SERVER+"/Login", {
  		body: 	JSON.stringify({ 
				"Username":req.body.testusername,
				"Password":req.body.testpassword,
				"DeviceId":req.body.testdeviceid
			}) ,
  			headers: {
				"Accept":"application/json",
				"Content-Type":"application/json"
			},
  		method: "post"
	}).then(async function(response) {
		return response.text();
	}).catch(function (err) {
		// There was an error
		console.warn('ERROR: ', err);
	});
	res.redirect(clientmachine+'index.html?test='+appPX_LOGIN+'&un='+req.body.testusername+'&pd='+req.body.testpassword+'&did='+req.body.testdeviceid+'&return='+pxLogin);
	doLog('Login = '+ pxLogin);
});
//
//	TEST OTP
//
app.post(appPX_OTP, async function(req, res) {
	doLog('otp authid ='+req.body.testauthid);
	doLog('otp deviceid='+req.body.testdeviceid);
	doLog('otp otp='+req.body.testotp);
	var pxOtp = "";
	pxOtp = await fetch(gsFETCH_FROM_SERVER+"/Login/Otp", {
  		body: 	JSON.stringify({ 
				"AuthId":req.body.testauthid,
				"DeviceId":req.body.testdeviceid,
				"Otp":req.body.testotp
			}) ,
  			headers: {
				"Accept":"application/json",
				"Content-Type":"application/json"
			},
  		method: "post"
	}).then(async function(response) {
		return response.text();
	}).catch(function (err) {
		// There was an error
		console.warn('ERROR: ', err);
	});
	res.redirect('/otp.html?test='+appPX_OTP+'&aid='+req.body.testauthid+'&did='+req.body.testdeviceid+'&otp='+req.body.testotp+'&return='+pxOtp);
	doLog('pxOtp = '+ pxLogin);
});
//
//	TEST GUILDS
//
app.post(appPX_GUILDS, async function(req, res) {
	doLog('pxsessionid = '+req.body.testsessionid);
	var pxGuilds = "";
	pxGuilds = await fetch(gsFETCH_FROM_SERVER+"/Chat/GetGuilds", {
  		headers: {
				"X-Zos-Session-Id":req.body.testsessionid,
				"Accept":"application/json",
				"Content-Type":"application/json"
			},
  		method: "get"
	}).then(async function(response) {
		return response.text();
	}).catch(function (err) {
		// There was an error
		console.warn('ERROR: ', err);
	});
	res.redirect(clientmachine+'/guilds.html?test='+appPX_GUILDS+'&sessionid='+req.body.testsessionid+'&return='+pxGuilds);
	doLog('pxGuilds = '+ pxGuilds);
});
//
//	TEST CONFIG
//
app.post(appPX_CONFIG, async function(req, res) {
	var pxConfig = "";
	pxConfig = await fetch(gsFETCH_FROM_SERVER+"/ClientConfig/GetConfig", {
  		headers: {
			},
  		method: "get"
	}).then(async function(response) {
		return response.text();
	}).catch(function (err) {
		// There was an error
		console.warn('ERROR: ', err);
	});
	res.redirect(clientmachine+'/config.html?test='+appPX_CONFIG+'&return='+pxConfig);
	doLog('pxConfig = '+ pxConfig);
});
//
//	NOTHING SPECIFIED / DEFAULT
//
app.get(gsNO_REQUEST, (req, res, next) => {
 res.send('this is the app server');
});

// END OF FILE





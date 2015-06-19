var setting = require('../setting');
var xmlParser = require('xml2js').parseString;
var https = require('https');

var _accessToken;
var refreshAccessToken = function() {
	var options = {
	  hostname	: 'api.weixin.qq.com',
	  port		: 443,
	  path		: '/cgi-bin/token?grant_type=client_credential&appid=' + setting.weixinAppId + '&secret=' + setting.weixinSecret,
	  method	: 'GET'
	};

	var req = https.request(options, function(res) {

	  res.on('data', function(d) {
	  	
	  	if (d != null) {
	  		var jd;
	  		jd = JSON.parse(d);
	  		if (jd.access_token != null) {
	  			_accessToken = jd.access_token;
	  			console.log("new token : " + _accessToken);
		  	} else {
		  		console.error(jd);
		  	}
	  	} 
	  });
	});
	req.end();

	req.on('error', function(e) {
	  console.error(e);
	});
};

setInterval(refreshAccessToken(), 7000000);

var sendCustomMsg = function(toUser) {
	var msg = {
		touser	: toUser,
		msgtype	: "text",
		text	: {
			content	: "收到!"
		}
	};
	var data = JSON.stringify(msg);
	var options = {
	  hostname	: 'api.weixin.qq.com',
	  port		: 443,
	  path		: '/cgi-bin/message/custom/send?access_token=' + _accessToken,
	  method	: 'POST',
	  headers	: {  
            "Content-Type"	: 'application/json',  
            "Content-Length": data.length  
        }  
	};
	console.dir(options);
	var req = https.request(options, function(res) {

	});
	req.write(data + "\n");
	req.end();

	req.on('error', function(e) {
	  console.error(e);
	});

}

function Weixin() {
	

}
module.exports = Weixin;

Weixin.handle = function(msg) {
	xmlParser(msg, { explicitArray : false, ignoreAttrs : true }, function(err, result) {
		console.log(result.xml.FromUserName);
		sendCustomMsg(result.xml.FromUserName);
	});
};

Weixin.accessToken = _accessToken;
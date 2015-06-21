var setting = require('../setting');

var https = require('https');
var url = require('url');

var _accessToken;

function WxMsg() {}
module.exports = WxMsg;

WxMsg.handle = function(msg) {
	if (msg.MsgType == 'text') {
		sendText(msg.FromUserName, '收到：' + msg.Content)
		return;
	}
	if (msg.MsgType == 'events') {
		if (msg.Event == 'LOCATION') {
			sendText(msg.FromUserName, '地理位置！');
			return;
		}
		if (msg.Event == 'CLICK') {
			sendText(msg.FromUserName, '菜单事件：' + msg.EventKey);
		}
	}

};


WxMsg.refreshAccessToken = function() {
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

var sendText = function(toUsr, content) {
	var data = JSON.stringify(
	{
		touser	: msg.FromUserName,
		msgtype	: "text",
		text	: 
		{
			content	: content
		}
	});
	sendMsg(data);
}

var sendMsg = function(data) {
	var options = url.parse("https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + _accessToken);
	options.method = "POST";
	options.port = 443;
	
	console.dir(options);
	var req = https.request(options, function(res) {

	});
	req.write(data + "\n");
	req.end();

	req.on('error', function(e) {
	  console.error(e);
	});

}
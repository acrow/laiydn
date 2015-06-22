var setting = require('../setting');
var https = require('https');
var url = require('url');
var crypto = require('crypto');

var _accessToken;
var _jsApiTicket;

function WxMsg() {}
module.exports = WxMsg;

WxMsg.handle = function(msg) {
	if (msg.MsgType == 'text') {
		sendText(msg.FromUserName, '收到：' + msg.Content)
		return;
	}
	if (msg.MsgType == 'event') {
		if (msg.Event == 'LOCATION') {
			sendText(msg.FromUserName, '地理位置！');
			return;
		}
		if (msg.Event == 'CLICK') {
			sendText(msg.FromUserName, '菜单事件：' + msg.EventKey);
		}
	}

};


var refreshJsApiTicket = function() {
	var options = {
	  hostname	: 'api.weixin.qq.com',
	  port		: 443,
	  path		: '/cgi-bin/ticket/getticket?type=jsapi&access_token=' + _accessToken,
	  method	: 'GET'
	};

	var req = https.request(options, function(res) {
	  res.on('data', function(d) {
	  	
	  	if (d != null) {
	  		var jd;
	  		jd = JSON.parse(d);
	  		if (jd.ticket != null) {
	  			_jsApiTicket = jd.ticket;
	  			console.log("new ticket : " + _jsApiTicket);
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
}

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
	  			refreshJsApiTicket(); // 得到新token后立即取得ticket
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
refreshAccessToken();
// 定时刷新微信accessToken
setInterval(refreshAccessToken, 7000000);


var sendText = function(toUsr, content) {
	var data = JSON.stringify(
	{
		touser	: toUsr,
		msgtype	: "text",
		text	: 
		{
			content	: content
		}
	});
	sendMsg(data);
};

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

};

WxMsg.generatePageConfig = function(url) {
	if (url == null) {
		url = 'http://www.laiyd.cn';
	}
	var noncestr = 'albbh40dd'
	var timestamp = new Date().getSeconds(); // 时间戳（秒）
	var paras = new Array();
    paras[0] = 'noncestr=' + noncestr; 
    paras[1] = 'jsapi_ticket=' + _jsApiTicket;	
    paras[2] = 'timestamp=' + timestamp;
    paras[3] = 'url=' + url;
    paras.sort();
    var sig = paras[0] + '&' + paras[1] + '&' + paras[2] +'&' + paras[3];
    console.log(sig);
    var sha1 = crypto.createHash('sha1');
    sha1.update(sig);
    var hsig = sha1.digest('hex');

    return {
    	debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	    appId: 'wx4dcce61ef82e8cfb', // 必填，公众号的唯一标识
	    timestamp: timestamp, // 必填，生成签名的时间戳
	    nonceStr: noncestr, // 必填，生成签名的随机串
	    signature: hsig,// 必填，签名，见附录1
	    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    }

};

WxMsg.accessToken = function() {
	return _accessToken;
};

WxMsg.jsApiTicket = function() {
	return _jsApiTicket;
};
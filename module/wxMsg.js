var setting = require('../setting');
var https = require('https');
var url = require('url');
var crypto = require('crypto');
var Member = require(./member);

var _accessToken;
var _jsApiTicket;

function WxMsg() {}
module.exports = WxMsg;

WxMsg.handle = function(msg, usr) {
	
	if (!usr.openId) {
		Member.getUserByOpenId(msg.FromUserName, function(err, mem) {
			if (err || !mem) {
				usr = new Member({openId: msg.FromUserName});
				usr.save();
			} else {
				usr = mem;
			}
		});
	}
	

	if (msg.MsgType == 'text') {
		sendText(msg.FromUserName, '收到：' + msg.Content)
		return;
	}
	if (msg.MsgType == 'event') {
		if (msg.Event == 'LOCATION') {
			usr.location = {x: msg.Location_X, y: msg.Location_Y};
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
	
	var req = https.request(options, function(res) {

	});
	req.write(data + "\n");
	req.end();

	req.on('error', function(e) {
	  console.error(e);
	});

};

WxMsg.generatePageConfig = function(url) {
	if (typeof url == "undefined") {
		url = 'http://www.laiyd.cn';
	}
	var noncestr = Math.random().toString(36).substr(2, 15);
	var timestamp = parseInt(new Date().getTime() / 1000) + ''; // 时间戳（秒）

	var paras = new Array();
	paras[0] = 'jsapi_ticket=' + _jsApiTicket;	
    paras[1] = 'noncestr=' + noncestr; 
    paras[2] = 'timestamp=' + timestamp;
    paras[3] = 'url=' + url;
    paras.sort();
    var sig = paras[0] + '&' + paras[1] + '&' + paras[2] +'&' + paras[3];
    console.log(sig);
    var sha1 = crypto.createHash('sha1');
    sha1.update(sig);
    var hsig = sha1.digest('hex');
    console.log(hsig);
    return {
    	debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	    appId: 'wx4dcce61ef82e8cfb', // 必填，公众号的唯一标识
	    timestamp: timestamp, // 必填，生成签名的时间戳
	    nonceStr: noncestr, // 必填，生成签名的随机串
	    signature: hsig,// 必填，签名，见附录1
	    url: url,
	    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'openLocation', 'getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    }

};

WxMsg.accessToken = function() {
	return _accessToken;
};

WxMsg.jsApiTicket = function() {
	return _jsApiTicket;
};

WxMsg.getUserInfo = function(openId, callback) {
	var options = {
	  hostname	: 'api.weixin.qq.com',
	  port		: 443,
	  path		: '/cgi-bin/user/info?access_token=' + _accessToken + '&openid=' + openId + '&lang=zh_CN',
	  method	: 'GET'
	};

	var req = https.request(options, function(res) {
	  res.on('data', function(d) {
	  	
	  	if (d != null) {
	  		var jd;
	  		jd = JSON.parse(d);
	  		if (jd.access_token != null) {
	  			callback(jd);
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
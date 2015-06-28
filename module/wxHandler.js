var setting = require('../setting');
var https = require('https');
var url = require('url');
var crypto = require('crypto');
// var Member = require('./member');

var _accessToken;
var _jsApiTicket;

function httpsGET(path, callback) {
	var options = url.parse(path);
	options.method = "GET";
	options.port = 443;
	var req = https.request(options, function(res) {
	  res.on('data', function(d) {
	  	
	  	if (d != null) {
	  		var jd = JSON.parse(d);
	  		callback(null, jd);
	  	} 
	  });
	});
	req.end();

	req.on('error', function(e) {
	  callback(e);
	});
}

function httpsPOST(path, data, callback) {
	var options = url.parse(path);
	options.method = "POST";
	options.port = 443;
	
	var req = https.request(options, function(res) {

	});
	req.write(data + "\n");
	req.end();

	req.on('error', function(e) {
	  callback(e);
	});
}

function refreshJsApiTicket() {
	httpsGET(
		'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=' + _accessToken,
		function(err, ticket) {
			if (err) {
				console.error(err);
				return;
			} 
			if (ticket.errcode != 0) {
				console.error(ticket.errmsg);
				return;
			}

			_jsApiTicket = ticket.ticket;
			
		}
	);
}

function refreshAccessToken() {
	httpsGET(
		'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + setting.weixinAppId + '&secret=' + setting.weixinSecret,
		function(err, token) {
			if (err) {
				console.error(err);
				return;
			}
			if (typeof token.access_token == 'undefined') {
				console.error(token);
				return;
			} 

			_accessToken = token.access_token;
			refreshJsApiTicket(); // 得到新token后立即取得ticket
			
		}
	);
}

refreshAccessToken();
// 定时刷新微信accessToken
setInterval(refreshAccessToken, 7000000);

function sendMsg(data) {
	httpsPOST(
		'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=' + _accessToken,
		data,
		function(err) {
			console.error(err);
		}
	);
};

function sendText(toUsr, content) {
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

function getUserInfo(openId, callback) {
	httpsGET(
		'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + _accessToken + '&openid=' + openId + '&lang=zh_CN',
		callback
	);
};

function getMember(usr) {
	var openId = usr.openId;
	var location = usr.location;
	Member.getUserByOpenId(openId, function(err, mem) { // 数据库中查找用户
		if (err || !mem) {
			getUserInfo(openId, function(err, u) { // 微信接口获取用户
				if (err || typeof u.openId == 'undefined') {
					usr = new Member({openId: openId});
				} else {
					usr  = u;
				}
				usr.save();
				usr.location = location;
			});
		} else {
			usr = mem;
			usr.location = location;
		}

	});
}

function WxHandler() {}
module.exports = WxHandler;

WxHandler.handle = function(msg, usr) {
	
	if (!usr.openId) {
		//getMember(usr);
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

WxHandler.generatePageConfig = function(url) {
	if (typeof url == "undefined") {
		url = setting.host;
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

WxHandler.accessToken = function() {
	return _accessToken;
};

WxHandler.jsApiTicket = function() {
	return _jsApiTicket;
};


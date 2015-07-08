var setting = require('../setting');
var https = require('https');
var url = require('url');
var crypto = require('crypto');
var Member = require('./member');

var _accessToken;
var _jsApiTicket;

// 通用GET方法
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

// 通用POST方法
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

// 刷新JsAPITicket(微信JsSDK配置用)
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

// 刷新微信AccessToken
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

// 发送消息
function sendMsg(data) {
	httpsPOST(
		'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=' + _accessToken,
		data,
		function(err) {
			console.error(err);
		}
	);
};

// 发送文本消息
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

// 通过微信接口API取得用户信息
function getWeixinUserInfo(openId, callback) {
	httpsGET(
		'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + _accessToken + '&openid=' + openId + '&lang=zh_CN',
		callback
	);
};

// 取得用户信息
function getMember(openId, callback) {
	var usr;
	Member.getUserByOpenId(openId, function(err, mem) { // 数据库中查找用户
		if (err || !mem || !mem.subscribeTime) { // 数据库没有取到，或者数据库取到的信息不完整
			getWeixinUserInfo(openId, function(err, u) { // 微信接口获取用户
				if (err || typeof u.openid == 'undefined') {
					usr = new Member({openId: openId});
				} else {
					usr  = new Member({
						openId: u.openid,
						city: u.city,
						province: u.province,
						country: u.country,
						groupId: u.groupid,
						headImgUrl: u.headimgurl,
						language: u.language,
						nickName: u.nickname,
						remark: u.remark,
						sex: u.sex,
						subscribeTime: u.subscribe_time
					});
				}
				callback(usr);
			});
		} else {
			callback(mem);
		}
	});
}

// 把用户信息保存在Session中
function saveMemberToSession(req, openId) {
	getMember(openId, function(usr) {
		req.session.usr = usr;
		req.session.save(function(err){
			if (err) {
				console.error(err);
			}
		});
	});
}

// 用微信用户信息更新db中记载用户信息
function updateMemberByWeixinUserInfo(openId) {
	getWeixinUserInfo(openId, function(err, u) { // 微信接口获取用户
		var usr;
		if (err || typeof u.openid == 'undefined') {
			return; // 没找到直接返回
		} else {
			usr  = new Member({
				openId: u.openid,
				city: u.city,
				province: u.province,
				country: u.country,
				groupId: u.groupid,
				headImgUrl: u.headimgurl,
				language: u.language,
				nickName: u.nickname,
				remark: u.remark,
				sex: u.sex,
				subscribeTime: u.subscribe_time
			});
		}
		Member.getUserByOpenId(openId, function(err, mem) { // 数据库中查找用户
			if (mem) {
				usr._id = mem._id;
				usr.location = mem.location;
			}
			usr.save(function(err){
				if (err) {
					console.error(err);
				} 
			}); 
		});
	});
}

/****************************** public method ****************************/
function WxHandler() {}
module.exports = WxHandler;

// 微信消息处理
WxHandler.handle = function(msg) {

	if (msg.MsgType == 'text') {
		sendText(msg.FromUserName, '收到：' + msg.Content + '  ' + JSON.stringify(msg));
		return;
	}
	if (msg.MsgType == 'event') {
		if (msg.Event == 'subscribe') { // 关注事件
			sendText(msg.FromUserName, '欢迎，感谢您的关注！赶快找找您感兴趣的活动吧。^_^【来运动】');
			updateMemberByWeixinUserInfo(msg.FromUserName);
			return;
		}
		if (msg.Event == 'unsubscribe') { // 取消关注事件
			getMember(msg.FromUserName, function(usr) {
				if (usr.subscribeTime) {
					usr.subscribeTime = null;
					usr.save(function(err){
						if (err) {
							console.error(err);
						} 
					}); 
				}
			});
			return;
		} 
		if (msg.Event == 'LOCATION') { // 地理位置 保存至db
			Member.updateLocation(msg.FromUserName, {x: msg.Longitude, y: msg.Latitude}, function(err) {
				if (err) {
					console.error(err);
				}
			});
			// sendText(msg.FromUserName, '地理位置:' + JSON.stringify(msg));

			return;
		}
		if (msg.Event == 'CLICK') { // 菜单事件
			sendText(msg.FromUserName, '菜单事件：' + msg.EventKey + '  '+ JSON.stringify(msg));
			return;
		}
	}

};

// 微信JsSDK配置
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
    var sha1 = crypto.createHash('sha1');
    sha1.update(sig);
    var hsig = sha1.digest('hex');
    return {
    	debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	    appId: setting.weixinAppId, // 必填，公众号的唯一标识
	    timestamp: timestamp, // 必填，生成签名的时间戳
	    nonceStr: noncestr, // 必填，生成签名的随机串
	    signature: hsig,// 必填，签名，见附录1
	    url: url,
	    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'openLocation', 'getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    }

};

// 当前AccessToken
WxHandler.accessToken = function() {
	return _accessToken;
};

// 当前JsApiTicket（微信JsSDK配置用)
WxHandler.jsApiTicket = function() {
	return _jsApiTicket;
};

// 用户通过WEB画面访问时，取得当前用户信息保存在session
WxHandler.authorize = function(req, code) {
	var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + setting.weixinAppId + '&secret='+ setting.weixinSecret + '&code='+ code + '&grant_type=authorization_code';
	httpsGET(
		url,
		function(err, au) {
			if (err) {
				console.error(err);
				return;
			}
			if (au.openid) {
				saveMemberToSession(req, au.openid);	
			} else {
				console.error(au.errmsg);
			}
		}
	);
};

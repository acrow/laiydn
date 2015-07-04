var express = require('express');
var xmlParser = require('xml2js').parseString;
var crypto = require('crypto');
var setting = require('../setting');
var wxHandler = require('../module/wxHandler');
var Member = require('../module/member');

var router = express.Router();

router.all('/', function(req, res, next) {
    // 验证消息来源
    if (req.param('signature') == null || req.param('timestamp') == null || req.param('nonce') == null) {
        res.send("err!");
        return;
    }
    var paras = new Array();
    paras[0] = setting.weixinUserToken; //token 与公众号设置需要保持一致
    paras[1] = req.param('timestamp');
    paras[2] = req.param('nonce');
    paras.sort();
    var sig = paras[0] + paras[1] + paras[2];
    var sha1 = crypto.createHash('sha1');
    sha1.update(sig);
    var hsig = sha1.digest('hex');
    if (hsig != req.param('signature')) {
        res.send("err!");
        return;
    }
    // 如果是测试直接返回测试值
	if (req.param('echostr')) {
		res.send(req.param('echostr'));
        return
	}
    // 正式开始处理消息
	// 设置接收数据编码格式为 UTF-8
    req.setEncoding('utf-8');
    var postData = ""; //POST & GET 
    // 数据块接收中
    req.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    // 数据接收完毕，执行回调函数
    req.addListener("end", function () {
        xmlParser(postData, { explicitArray : false, ignoreAttrs : true }, function(err, result) {
			wxHandler.handle(result.xml);
		});
    });
	
    res.send("");
});

router.get('/getConfig', function(req, res, next) {
    var url = req.param('url');
    url = decodeURIComponent(url);
    res.send(wxHandler.generatePageConfig(url));
});

router.get('/ping', function(req, res, next) {
    res.send(wxHandler.accessToken() + " | " + wxHandler.jsApiTicket());
});

router.get('/usr', function(req, res, next) {
    var openId = req.param('openId');
    if (typeof openId == 'undefined') {
        res.send(JSON.stringify(req.session.usr));
        return;
    }
    Member.getUserByOpenId(openId, function(err, mem) { // 数据库中查找用户
        if (err) { 
            res.send(err);
            return;
        } 
        if (!mem) {
            res.send('not find');
            return;
        }
        res.send(JSON.stringify(mem));
    });
});

/******************************* web page ***********************************/

router.get('/web', function(req, res, next) {
    if (!req.session.usr) {
        if (req.param('code')) {
            wxHandler.authorize(req, req.param('code'));

        } else { // 如果用户未登录则重定向验证用户
            var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ setting.weixinAppId +'&redirect_uri='+ encodeURIComponent('http://' + setting.host + req.baseUrl + req.url) +'&response_type=code&scope=snsapi_base#wechat_redirect';
            res.redirect(url);
            return; 
        }
    }
    
    res.render('index');
});

module.exports = router;	
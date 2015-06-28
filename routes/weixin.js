var express = require('express');
var router = express.Router();
var wxHandler = require('../module/wxHandler');
var xmlParser = require('xml2js').parseString;
var crypto = require('crypto');

router.all('/', function(req, res, next) {
    // 验证消息来源
    if (req.param('signature') == null || req.param('timestamp') == null || req.param('nonce') == null) {
        res.send("sorry!");
        return;
    }
    var paras = new Array();
    paras[0] = 'albbh40dd'; //token 与公众号设置需要保持一致
    paras[1] = req.param('timestamp');
    paras[2] = req.param('nonce');
    paras.sort();
    var sig = paras[0] + paras[1] + paras[2];
    var sha1 = crypto.createHash('sha1');
    sha1.update(sig);
    var hsig = sha1.digest('hex');
    if (hsig != req.param('signature')) {
        res.send("sorry!");
        return;
    }
    // 如果是测试直接返回测试值
	var echostr = req.param('echostr')
	if (echostr != null) {
		console.log("test connect: " + echostr);
		res.send(echostr);
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
            if (!req.session.usr) {
                req.session.usr = {};
            }
			wxHandler.handle(result.xml, req.session.usr);
		});
    });
	
    res.send("");
});

router.get('/getConfig', function(req, res, next) {
    var url = req.param('url');
    console.log(url);
    url = decodeURIComponent(url);
    res.send(wxHandler.generatePageConfig(url));
});

router.get('/ping', function(req, res, next) {
    res.send(wxHandler.accessToken() + " | " + wxHandler.jsApiTicket());
});

router.get('/cusr', function(req, res, next) {
    res.send(JSON.stringify(req.session.usr));
});
module.exports = router;	
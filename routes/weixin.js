var express = require('express');
var xmlParser = require('xml2js').parseString;
var crypto = require('crypto');
var setting = require('../setting');
var wxHandler = require('../module/wxHandler');
var Member = require('../module/member');
var Activity = require('../module/activity');

var router = express.Router();

router.all('/', function(req, res, next) {
    // 验证消息来源
    if (req.query.signature == null || req.query.timestamp == null || req.query.nonce == null) {
        res.send("err!");
        return;
    }
    var paras = new Array();
    paras[0] = setting.weixinUserToken; //token 与公众号设置需要保持一致
    paras[1] = req.query.timestamp;
    paras[2] = req.query.nonce;
    paras.sort();
    var sig = paras[0] + paras[1] + paras[2];
    var sha1 = crypto.createHash('sha1');
    sha1.update(sig);
    var hsig = sha1.digest('hex');
    if (hsig != req.query.signature) {
        res.send("err!");
        return;
    }
    // 如果是测试直接返回测试值
	if (req.query.echostr) {
		res.send(req.query.echostr);
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

// 取得微信注入用配置信息
router.get('/getConfig', function(req, res, next) {
    var url = req.query.url;
    url = decodeURIComponent(url);
    res.send(wxHandler.generatePageConfig(url));
});

// 测试用
router.get('/ping', function(req, res, next) {
    res.send(wxHandler.accessToken() + " | " + wxHandler.jsApiTicket());
});

// 取得用户，无参数是返回当前用户
router.get('/usr', function(req, res, next) {
    var openId = req.query.openId;
    if (typeof openId == 'undefined') {
        res.json(req.session.usr);
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
        res.json(mem);
    });
});

/******************************* web page ***********************************/
// 检查用户是否已经认证，未认证则执行认证

function checkAuth(req, res) {
    if (!req.session.usr) {
        // 当前访问的url
        var url = 'http://' + setting.host + req.baseUrl + req.url; 
        // 微信验证成功后返回的url
        url = "http://www.laiyd.cn/weixin/web/auth?redirect_uri=" + encodeURIComponent(url); 
        // 微信验证用的url
        url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ setting.weixinAppId +'&redirect_uri='+ encodeURIComponent(url) +'&response_type=code&scope=snsapi_base#wechat_redirect';
        // 跳转到微信认证
        res.redirect(url);
        return false; 
    }
    return true;
}
// 用户认证时需要跳转到此地址
router.get('/web/auth', function(req, res, next) {
    wxHandler.authorize(req, req.query.code);
    if (req.query.redirect_uri.indexOf('clientpath=edit') > -1) {
        req.query.redirect_uri = req.query.redirect_uri+'#edit';
    }
    res.redirect(req.query.redirect_uri);
});
// 测试用
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
// 我的活动画面
router.get('/web/myAct', function(req, res, next) {
    if (checkAuth(req, res)) { // 要求用户认证
        res.render('actMine');    
    }
});
// 编辑活动画面
router.get('/web/editAct', function(req, res, next) {
    if (checkAuth(req, res)) { // 要求用户认证
        //res.render('actEdit');
        res.redirect('http://www.laiyd.cn/weixin/web/myAct#/edit')
    }
});
// 搜索活动画面
router.get('/web/searchAct', function(req, res, next) {
    if (checkAuth(req, res)) { // 要求用户认证
        //res.render('actSearch');
        res.redirect('http://www.laiyd.cn/weixin/web/myAct#/search')
    }
});
// 查看活动画面
router.get('/web/viewAct/:actId', function(req, res, next) {
    var openId = '';
    var isJoined = 0;
    var msg = '';
    if (req.query.isJoin) { // 如果是参加申请
        if (!checkAuth(req, res)) { // 要求用户认证
            return false;
        }
    }
    if (req.session.usr) {
        openId = req.session.usr.openId;
    }
    Activity.get(req.params.actId, function(err, act) {
        act.userCount = 0;
        
        if (act.applications) {
            for(var i = 0; i < act.applications.length; i++) {
                var mem = act.applications[i];
                if (mem.status == '通过') {
                    act.userCount += mem.userCount;
                } 
                if (mem.owner == '是') {
                    act.owner = mem;
                }
                if (!isJoined && openId && mem.openId == openId) {
                    isJoined = 1;
                    if (mem.status == '通过') {
                        isJoined = 2;
                    } else if (mem.status == '拒绝') {
                        isJoined = 3;
                    } 
                } 
            }
        }
        var jsConfig = '';
        if (req.query.isShare) { // 如果是分享
            var url = 'http://www.laiyd.cn/weixin' + req.url;
            url = decodeURIComponent(url);
            jsConfig = JSON.stringify(wxHandler.generatePageConfig(url));
            act.shareMsg = act.content + ' ' + act.startTime + ' ' + act.address;
        }
        var str = JSON.stringify(act);
        res.render('actView',{activity: act, actStr: str, isShare: req.query.isShare, jsConfig: jsConfig, openId: openId, isJoined: isJoined, msg: msg});
    });
});

module.exports = router;	
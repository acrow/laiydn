var express = require('express');
var router = express.Router();
var weixin = require('../module/Weixin');



/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.all('/weixin', function(req, res, next) {
	var echostr = req.param('echostr')
	if (echostr != null) {
		console.log("test connect: " + echostr);
		res.send(echostr);
	}
	
	// 设置接收数据编码格式为 UTF-8
    req.setEncoding('utf-8');
    var postData = ""; //POST & GET 
    // 数据块接收中
    req.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    // 数据接收完毕，执行回调函数
    req.addListener("end", function () {
        console.log("weixin msg : " + postData);
        weixin.handle(postData);
    });
	
	
    res.send("");
});

module.exports = router;	

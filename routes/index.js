var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/weixin', function(req, res, next) {
	var echostr = req.param('echostr')
	console.log(echostr);
	res.send(echostr);

});

module.exports = router;
